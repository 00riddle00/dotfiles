-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-03 20:27:35 CEST
-- Path:   ~/.config/nvim/lua/plugins/blink_cmp.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("blink.cmp").setup({
  keymap = {
    preset = "default",

    -- Keep these for Copilot / your existing mappings.
    ["<Tab>"] = false,
    ["<S-Tab>"] = false,
    ["<C-n>"] = false,
    ["<C-p>"] = false,
  },

  completion = {
    documentation = {
      auto_show = true,
      auto_show_delay_ms = 300,
    },
    ghost_text = {
      enabled = false,
    },
  },

  sources = {
    default = {
      "lsp",
      "path",
      "snippets",
      "buffer",
    },
  },
})
