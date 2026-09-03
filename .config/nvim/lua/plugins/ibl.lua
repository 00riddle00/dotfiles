-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-03 20:13:11 CEST
-- Path:   ~/.config/nvim/lua/plugins/ibl.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local hooks = require("ibl.hooks")
local palette = require("plugins._rainbow_palette")

hooks.register(hooks.type.HIGHLIGHT_SETUP, function()
  palette.set_highlights()
end)

palette.set_highlights()

require("ibl").setup({
  enabled = false,
  indent = {
    char = "▏",
    highlight = palette.indent_highlight,
  },
  scope = {
    enabled = false,
  },
})
