-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:50 CEST
-- Path:   ~/.config/nvim/lua/plugins/vimtex.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Setting vimtex view method using a generic interface
vim.g.vimtex_view_general_viewer = "zathura"

-- Setting vimtex compiler engines
vim.g.vimtex_compiler_latexmk_engines = {
  ["_"] = "-xelatex",
}

-- Setting vimtex quickfix ignore filters
vim.g.vimtex_quickfix_ignore_filters = {
  "Underfull",
  "Overfull",
}
