-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-03 20:28:01 CEST
-- Path:   ~/.config/nvim/lua/plugins/copilot_config.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("copilot").setup({
  panel = {
    enabled = true,
    auto_refresh = false,
    keymap = {
      jump_next = "]]", -- was <C-n>
      jump_prev = "[[", -- was <C-p>
      accept = "<CR>",
      refresh = "gr",
      open = "<M-r>",
    },
    layout = {
      position = "bottom", -- | top | left | right | horizontal | vertical
      ratio = 0.4,
    },
  },
  suggestion = {
    enabled = true,
    auto_trigger = true,
    keymap = {
      --accept = "<TAB>",
      accept = false, -- <TAB> is used, but it's handled by the smart-tab mapping in lua/config/keybindings.lua
      accept_word = "<M-CR>",
      next = "<C-n>",
      prev = "<C-p>",
    },
  },
  filetypes = {
    ["*"] = true,
  },
  server_opts_overrides = {
    offset_encoding = "utf-16",
    settings = {
      telemetry = {
        telemetryLevel = "off",
      },
    },
  },
})

vim.api.nvim_create_autocmd("User", {
  pattern = "BlinkCmpMenuOpen",
  callback = function()
    require("copilot.suggestion").dismiss()
    vim.b.copilot_suggestion_hidden = true
  end,
})

vim.api.nvim_create_autocmd("User", {
  pattern = "BlinkCmpMenuClose",
  callback = function()
    vim.b.copilot_suggestion_hidden = false
  end,
})
