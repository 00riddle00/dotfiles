-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:21 CEST
-- Path:   ~/.config/nvim/lua/plugins/ibl.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local M = {}

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
    enabled = true,
  },
})

local ibl_enabled = false

function M.toggle()
  ibl_enabled = not ibl_enabled
  require("ibl").update({ enabled = ibl_enabled })
end

function M.enable()
  ibl_enabled = true
  require("ibl").update({ enabled = true })
end

function M.disable()
  ibl_enabled = false
  require("ibl").update({ enabled = false })
end

return M
