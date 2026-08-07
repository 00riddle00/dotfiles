-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:42 CEST
-- Path:   ~/.config/nvim/lua/plugins/rainbow_delimiters.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local palette = require("plugins._rainbow_palette")

palette.set_highlights()

vim.g.rainbow_delimiters = {
  highlight = palette.delimiter_highlight,
}
