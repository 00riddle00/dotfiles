-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 04:21:17 CEST
-- Path:   ~/.config/nvim/lua/plugins/vim_emacscommandline.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "houtsnip/vim-emacscommandline",

  init = function()
    vim.g.EmacsCommandLineSearchCommandLineDisable = 1
    vim.g.EmacsCommandLineOlderMatchingCommandLineDisable = 1
    vim.g.EmacsCommandLineNewerMatchingCommandLineDisable = 1
  end,
}
