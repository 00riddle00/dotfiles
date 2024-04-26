-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-04-22 02:17:47 EEST
-- Path:   ~/.config/nvim/lua/autocmd.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local General = require("general")
local vim = vim or {}
local augroup = vim.api.nvim_create_augroup
local autocmd = vim.api.nvim_create_autocmd

local general = augroup("00RIDDLE00_GENERAL_LUA", {})

-- Autosave when text changes or when exiting insert mode.
autocmd({ "TextChanged", "InsertLeave" }, {
  pattern = "*",
  callback = function ()
    if
      vim.bo.readonly
      or vim.api.nvim_buf_get_name(0) == ""
      or vim.bo.buftype ~= ""
      or not (vim.bo.modifiable and vim.bo.modified)
    then return end
    vim.cmd("silent w")
    vim.cmd("doau BufWritePost")
  end,
  group = general,
})

-- Disable linting and syntax highlighting for large files
autocmd("BufReadPre", {
  callback = function()
    if vim.fn.getfsize(vim.fn.expand("%")) > 10000000 then
      vim.cmd("syntax off")
      vim.g.ale_enabled = 0
      vim.g.coc_enabled = 0
    end
  end,
  group = general
})

-- http://vim.wikia.com/wiki/Speed_up_Syntax_Highlighting
autocmd("syntax", {
  callback = function()
    local line = vim.fn.line

    if 2000 < line("$") then
      vim.cmd("syntax sync maxlines=200")
    end
  end,
  group = general
})

-- Automatically remove trailing whitespaces unless file is blacklisted.
autocmd("BufWritePre", {
  callback = function()
    General.Preserve(function() vim.cmd("%s/\\s\\+$//e") end)
  end,
  group = general
})

-- Ensure directory structure exists when opening a new file.
autocmd("BufNewFile", {
  callback = function() General.EnsureDirExists() end,
  group = general
})

-- Open help window vertically.
autocmd("FileType", {
  pattern = "help",
  command = "wincmd L",
  group = general,
})

autocmd("FileType", {
  pattern = "python",
  callback = function()
    vim.opt.colorcolumn = "-1"
    vim.cmd("highlight ColorColumn ctermbg=black")
  end,
  group = general,
})

autocmd("FileType", {
  pattern = "markdown",
  callback = function()
    vim.opt_local.shiftwidth = 2
    vim.opt_local.tabstop = 2
    vim.opt_local.softtabstop = 2
    vim.cmd("colorscheme miro8")
  end,
  group = general,
})

autocmd({"BufNewFile", "BufRead"}, {
  pattern = {"*.asm", "*.ASM", "*.bat", "*.BAT", "*.bnf", "*.lst"},
  callback = function(args)
    local filetypes = {
      asm = "tasm",
      bat = "dosbatch",
      bnf = "bnf",
      lst = "text",
    }
    local ft = filetypes[vim.fn.fnamemodify(args.file, ":e"):lower()]
    if ft then
      vim.bo.filetype = ft
      if ft == "tasm" or ft == "dosbatch" then
        vim.cmd("set syntax=" .. ft)
      end
    end
  end,
  group = general,
})

autocmd("FileType", {
  pattern = "tex",
  callback = function()
    vim.g.Tex_GotoError = 0
    -- ^--- This is a temporary fix - to keep the cursor inside the editor
    --      buffer after compilation, and not moving it to the quickfix buffer.
    vim.opt.textwidth = 100
    vim.opt.colorcolumn = "-1"
    vim.cmd("highlight ColorColumn ctermbg=black")
    vim.api.nvim_buf_set_keymap(0, "n", "<space><space>", "/(<>)<CR>", {noremap = true})
    vim.api.nvim_buf_set_keymap(0, "i", ";c", "\\ctext[RGB]{0,255,255}{} (<>)<Esc>T{i", {noremap = true})
    vim.api.nvim_buf_set_keymap(0, "i", ";it", "\\textit{} (<>)<Esc>T{i", {noremap = true})
    vim.api.nvim_buf_set_keymap(0, "i", ';"', "„“ (<>)<Esc>T„i", {noremap = true})
  end,
  group = general,
})

local qf_group = augroup("00RIDDLE00__QF", {})

-- NOTE: open quickfix window after vim grep.
-- ref: https://www.reddit.com/r/vim/comments/bmh977/automatically_open_quickfix_window_after/
autocmd("QuickFixCmdPost", {
  pattern = "[^l]*",
  command = "cwindow",
  group = qf_group
})

autocmd("QuickFixCmdPost", {
  pattern = "l*",
  command = "lwindow",
  group = qf_group
})

-------------------------------------------
-- [Plugin] "preservim/nerdtree"
-------------------------------------------

-- Close Neovim if the only window left open is a NERDTree
vim.api.nvim_create_autocmd("BufEnter", {
  pattern = "*",
  callback = function()
    if vim.fn.winnr("$") == 1 and vim.b.NERDTree and vim.b.NERDTree.isTabTree() then
      vim.cmd("q")
    end
  end,
})

-- Open a NERDTree automatically when Neovim starts up
vim.api.nvim_create_autocmd("VimEnter", {
  pattern = "*",
  command = "NERDTree",
})

-- Focus the window and not the NERDTree (which is also opened) when Neovim starts up
vim.api.nvim_create_autocmd("VimEnter", {
  pattern = "*",
  command = "wincmd p",
})

-- Open a NERDTree automatically when Neovim starts up if no files were specified
-- (1) Checking if stdin is being used
vim.g.std_in = 0
vim.api.nvim_create_autocmd("StdinReadPre", {
  pattern = "*",
  callback = function()
    vim.g.std_in = 1
  end,
})

-- Open a NERDTree automatically when Neovim starts up if no files were specified
-- (2) Checking if no files were specified
vim.api.nvim_create_autocmd("VimEnter", {
  pattern = "*",
  callback = function()
    if vim.fn.argc() == 0 and vim.g.std_in == 0 then
      vim.cmd("NERDTree")
    end
  end,
})

---------------------------------------------
-- [Plugin] "nvim-treesitter/nvim-treesitter"
---------------------------------------------
-- Users of packer.nvim have reported that when using treesitter for folds,
-- they sometimes receive an error "No folds found", or that treesitter
-- highlighting does not apply. A workaround for this is to set the folding
-- options in an autocmd:
vim.api.nvim_create_autocmd({"BufEnter","BufAdd","BufNew","BufNewFile","BufWinEnter"}, {
  group = vim.api.nvim_create_augroup("TS_FOLD_WORKAROUND", {}),
  callback = function()
    vim.opt.foldmethod     = "expr"
    vim.opt.foldexpr       = "nvim_treesitter#foldexpr()"
  end
})
