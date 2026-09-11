-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:48 CEST
-- Path:   ~/.config/nvim/lua/plugins/tokyonight.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  "folke/tokyonight.nvim",
  priority = 1000,
  lazy = false,
  config = function()
    vim.cmd([[colorscheme tokyonight]])
  end,
}
