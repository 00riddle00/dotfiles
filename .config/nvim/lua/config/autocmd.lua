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

local general = augroup("00RIDDLE00_GENERAL", {})

-------------------------------------------
-- General editing
-------------------------------------------

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
    vim.cmd("silent write")
  end,
  group = general,
})

-- Automatically remove trailing whitespace unless the filetype is blacklisted.
autocmd("BufWritePre", {
  callback = function()
    local blacklist = {
      -- markdown = true,
    }

    if blacklist[vim.bo.filetype] then
      return
    end

    General.Preserve(function()
      vim.cmd("%s/\\s\\+$//e")
    end)
  end,
  group = general,
})

-- Keep gq using Neovim's built-in formatter instead of LSP formatting.
autocmd("LspAttach", {
  callback = function(args)
    vim.bo[args.buf].formatexpr = nil
  end,
  group = general,
  desc = "LSP: Keep gq using the built-in formatter",
})

-------------------------------------------
-- Files and buffers
-------------------------------------------

-- Ensure directory structure exists when opening a new file.
autocmd("BufNewFile", {
  callback = function()
    General.EnsureDirExists()
  end,
  group = general,
})

-------------------------------------------
-- Windows and display
-------------------------------------------

-- Move help windows to a vertical split on the far right.
autocmd("FileType", {
  pattern = "help",
  command = "wincmd L",
  group = general,
})

-- Disable folds in diff windows that exist when Neovim starts.
autocmd("VimEnter", {
  callback = function()
    for _, win in ipairs(vim.api.nvim_list_wins()) do
      if vim.wo[win].diff then
        vim.wo[win].foldenable = false
        vim.wo[win].foldmethod = "manual"
      end
    end
  end,
  group = general,
})

-------------------------------------------
-- Filetypes
-------------------------------------------

-- Git commit message: 50-char subject guide and 72-char body guide.
autocmd("FileType", {
  pattern = "gitcommit",
  callback = function()
    vim.opt_local.colorcolumn = "50,72"
  end,
  group = general,
})

-- Python: use an 88-column ruler without enabling automatic wrapping.
autocmd("FileType", {
  pattern = "python",
  callback = function()
    -- 1. Use an absolute number so it doesn't care about 'textwidth'.
    vim.opt_local.colorcolumn = "88"
    -- 2. Ensure auto-wrap is OFF even if a plugin tries to turn it on.
    vim.opt_local.textwidth = 0
  end,
  group = general,
})

-- Markdown: use two-space indentation.
autocmd("FileType", {
  pattern = "markdown",
  callback = function()
    vim.opt_local.shiftwidth = 2
    vim.opt_local.tabstop = 2
    vim.opt_local.softtabstop = 2
  end,
  group = general,
})

-- Configure TeX-specific editing behavior.
autocmd("FileType", {
  pattern = "tex",
  callback = function()
    vim.opt_local.textwidth = 100
    vim.opt_local.colorcolumn = "-1"
    vim.cmd("highlight ColorColumn cterm=NONE ctermbg=black")

    -- TODO: Consider moving these buffer-local mappings to keybindings.lua.
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

-------------------------------------------
-- Quickfix and location lists
-------------------------------------------

local quickfix_group = augroup("00RIDDLE00_QUICKFIX", {})

-- Open the quickfix window after :vimgrep and other quickfix commands.
-- Ref: https://www.reddit.com/r/vim/comments/bmh977/automatically_open_quickfix_window_after/
autocmd("QuickFixCmdPost", {
  pattern = "[^l]*",
  command = "cwindow",
  group = quickfix_group,
})

-- Open the location-list window after :lvimgrep and other location-list commands.
autocmd("QuickFixCmdPost", {
  pattern = "l*",
  command = "lwindow",
  group = quickfix_group,
})

---------------------------------------------------------
-- [Plugin] "saghen/blink.cmp" + "zbirenbaum/copilot.lua"
---------------------------------------------------------

-- Hide Copilot suggestions while the Blink completion menu is open.
autocmd("User", {
  pattern = "BlinkCmpMenuOpen",
  callback = function()
    vim.b.copilot_suggestion_hidden = true
  end,
  group = general,
})

-- Show Copilot suggestions again when the Blink completion menu closes.
autocmd("User", {
  pattern = "BlinkCmpMenuClose",
  callback = function()
    vim.b.copilot_suggestion_hidden = false
  end,
  group = general,
})

---------------------------------------------
-- [Plugin] "neovim/nvim-lspconfig"
---------------------------------------------

local lsp_ruff_group = augroup("00RIDDLE00_LSP_RUFF", {})

-- Disable Ruff hover when another Python LSP, such as Pyright, provides it.
autocmd("LspAttach", {
  group = lsp_ruff_group,
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if client == nil then
      return
    end

    if client.name == "ruff" then
      client.server_capabilities.hoverProvider = false
    end
  end,
  desc = "LSP: Disable hover capability from Ruff",
})

---------------------------------------------
-- [Plugin] "nvim-treesitter/nvim-treesitter"
---------------------------------------------

-- Enable Tree-sitter highlighting, folding, and indentation for eligible files.
autocmd("FileType", {
  callback = function(args)
    local filetype = vim.bo[args.buf].filetype
    local lang = vim.treesitter.language.get_lang(filetype)

    if not lang then
      return
    end

    -- Tree-sitter is intentionally disabled for these filetypes.
    if lang == "c" or lang == "rust" or lang == "markdown" then
      return
    end

    local ok, stats =
      pcall(vim.uv.fs_stat, vim.api.nvim_buf_get_name(args.buf))

    if ok and stats and stats.size > 100 * 1024 then
      return
    end

    if not pcall(vim.treesitter.start, args.buf) then
      return
    end

    if vim.treesitter.query.get(lang, "folds") then
      vim.wo.foldexpr = "v:lua.vim.treesitter.foldexpr()"
      vim.wo.foldmethod = "expr"
    end

    if vim.treesitter.query.get(lang, "indents") then
      vim.bo[args.buf].indentexpr =
        "v:lua.require'nvim-treesitter'.indentexpr()"
    end
  end,
  group = general,
})

-------------------------------------------
-- [Plugin] "xiyaowong/virtcolumn.nvim"
-------------------------------------------

-- Keep virtcolumn.nvim's ruler aligned with 'textwidth'.
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
