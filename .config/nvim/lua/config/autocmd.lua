-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-23 20:25:56 CEST
-- Path:   ~/.config/nvim/lua/config/autocmd.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local General = require("config.general")
local vim = vim or {}
local augroup = vim.api.nvim_create_augroup
local autocmd = vim.api.nvim_create_autocmd

local general = augroup("00RIDDLE00_GENERAL_LUA", {})

-- Autosave when text changes or when exiting insert mode.
autocmd({ "TextChanged", "InsertLeave" }, {
  pattern = "*",
  callback = function()
    if
      vim.bo.readonly
      or vim.api.nvim_buf_get_name(0) == ""
      or vim.bo.buftype ~= ""
      or not (vim.bo.modifiable and vim.bo.modified)
    then
      return
    end
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
  group = general,
})

-- https://vim.wikia.com/wiki/Speed_up_Syntax_Highlighting
autocmd("syntax", {
  callback = function()
    local line = vim.fn.line

    if 2000 < line("$") then
      vim.cmd("syntax sync maxlines=200")
    end
  end,
  group = general,
})

-- Automatically remove trailing whitespaces unless file is blacklisted.
autocmd("BufWritePre", {
  callback = function()
    -- For debugging:
    --print("BUFWRITEPRE, filetype="..vim.bo.filetype)
    General.Preserve(function()
      vim.cmd("%s/\\s\\+$//e")
    end)
  end,
  group = general,
  pattern = "*",
})

-- Ensure directory structure exists when opening a new file.
autocmd("BufNewFile", {
  callback = function()
    General.EnsureDirExists()
  end,
  group = general,
})

-- Open help window vertically.
autocmd("FileType", {
  pattern = "help",
  command = "wincmd L",
  group = general,
})

-- Git commit message: 50-char subject guide, 72-char body wrap.
autocmd("FileType", {
  pattern = "gitcommit",
  callback = function()
    vim.opt_local.colorcolumn = "50,72"
    vim.opt_local.formatoptions:append("t")
  end,
})

-- Global: Show a ruler at textwidth whenever textwidth is > 0
autocmd({ "BufWinEnter", "BufWritePost", "FileType" }, {
  group = general,
  callback = function()
    local tw = vim.bo.textwidth
    if tw > 0 then
      vim.opt_local.colorcolumn = tostring(tw)
      -- Clear the default blocky background so the 'virt-column'
      -- plugin can draw a thin character in its place.
      -- << THIS IS STILL HACKY >>
      vim.api.nvim_set_hl(0, "ColorColumn", { bg = "NONE", ctermbg = "NONE" })
    end
  end,
})

autocmd("FileType", {
  pattern = "python",
  callback = function()
    -- 1. Use an absolute number so it doesn't care about 'textwidth'
    vim.opt_local.colorcolumn = "88"
    -- 2. Ensure auto-wrap is OFF even if a plugin tries to turn it on
    vim.opt_local.textwidth = 0
  end,
  group = general,
})

autocmd("FileType", {
  pattern = "markdown",
  callback = function()
    vim.opt_local.shiftwidth = 2
    vim.opt_local.tabstop = 2
    vim.opt_local.softtabstop = 2
  end,
  group = general,
})

autocmd({ "BufNewFile", "BufRead" }, {
  pattern = { "*.asm", "*.ASM", "*.bat", "*.BAT", "*.bnf", "*.lst" },
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
    vim.cmd("highlight ColorColumn cterm=NONE ctermbg=black")
    vim.api.nvim_buf_set_keymap(
      0,
      "n",
      "<space><space>",
      "/(<>)<CR>",
      { noremap = true }
    )
    vim.api.nvim_buf_set_keymap(
      0,
      "i",
      ";c",
      "\\ctext[RGB]{0,255,255}{} (<>)<Esc>T{i",
      { noremap = true }
    )
    vim.api.nvim_buf_set_keymap(
      0,
      "i",
      ";it",
      "\\textit{} (<>)<Esc>T{i",
      { noremap = true }
    )
    vim.api.nvim_buf_set_keymap(
      0,
      "i",
      ';"',
      "„“ (<>)<Esc>T„i",
      { noremap = true }
    )
  end,
  group = general,
})

local qf_group = augroup("00RIDDLE00__QF", {})

-- NOTE: open quickfix window after vim grep.
-- ref: https://www.reddit.com/r/vim/comments/bmh977/automatically_open_quickfix_window_after/
autocmd("QuickFixCmdPost", {
  pattern = "[^l]*",
  command = "cwindow",
  group = qf_group,
})

autocmd("QuickFixCmdPost", {
  pattern = "l*",
  command = "lwindow",
  group = qf_group,
})

---------------------------------------------
-- [Plugin] "neovim/nvim-lspconfig"
---------------------------------------------

-- If using Ruff alongside another language server (like Pyright), one may want
-- to defer to that language server for certain capabilities, like
-- textDocument/hover:
autocmd("LspAttach", {
  group = vim.api.nvim_create_augroup(
    "lsp_attach_disable_ruff_hover",
    { clear = true }
  ),
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if client == nil then
      return
    end
    if client.name == "ruff" then
      -- Disable hover in favor of Pyright
      client.server_capabilities.hoverProvider = false
    end
  end,
  desc = "LSP: Disable hover capability from Ruff",
})

---------------------------------------------
-- [Plugin] "nvim-treesitter/nvim-treesitter"
---------------------------------------------
-- Users of packer.nvim have reported that when using treesitter for folds,
-- they sometimes receive an error "No folds found", or that treesitter
-- highlighting does not apply. A workaround for this is to set the folding
-- options in an autocmd:
autocmd({ "BufEnter", "BufAdd", "BufNew", "BufNewFile", "BufWinEnter" }, {
  group = vim.api.nvim_create_augroup("TS_FOLD_WORKAROUND", {}),
  callback = function()
    vim.opt.foldmethod = "expr"
    vim.opt.foldexpr = "nvim_treesitter#foldexpr()"
  end,
})

---------------------------------------------
-- [Plugin] "nvim-tree/nvim-tree.lua"
---------------------------------------------

-- Close the tab/nvim when nvim-tree is the last window.
autocmd("QuitPre", {
  callback = function()
    local tree_wins = {}
    local floating_wins = {}
    local wins = vim.api.nvim_list_wins()
    for _, w in ipairs(wins) do
      local bufname = vim.api.nvim_buf_get_name(vim.api.nvim_win_get_buf(w))
      if bufname:match("NvimTree_") ~= nil then
        table.insert(tree_wins, w)
      end
      if vim.api.nvim_win_get_config(w).relative ~= "" then
        table.insert(floating_wins, w)
      end
    end
    if 1 == #wins - #floating_wins - #tree_wins then
      -- Should quit, so close all invalid windows.
      for _, w in ipairs(tree_wins) do
        vim.api.nvim_win_close(w, true)
      end
    end
  end,
})

autocmd("VimEnter", {
  callback = function()
    for _, win in ipairs(vim.api.nvim_list_wins()) do
      if vim.api.nvim_win_get_option(win, "diff") then
        vim.api.nvim_win_set_option(win, "foldenable", false)
        vim.api.nvim_win_set_option(win, "foldmethod", "manual")
      end
    end
  end,
})

autocmd({ "BufWinEnter" }, {
  callback = function()
    if vim.wo.diff then
      vim.opt_local.foldenable = false
      vim.opt_local.foldmethod = "manual"
    end
  end,
})

-- markdown treesitter emergency disable
autocmd("FileType", {
  pattern = { "markdown", "markdown_inline" },
  callback = function(args)
    pcall(vim.treesitter.stop, args.buf)
  end,
})
