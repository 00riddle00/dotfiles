-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-07-13 16:00:49 EEST
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
