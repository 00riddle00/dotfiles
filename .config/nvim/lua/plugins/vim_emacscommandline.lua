-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-23 20:26:24 CEST
-- Path:   ~/.config/nvim/lua/plugins/vim_emacscommandline.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

vim.g.EmacsCommandLineSearchCommandLineDisable = 1
vim.g.EmacsCommandLineOlderMatchingCommandLineDisable = 1
vim.g.EmacsCommandLineNewerMatchingCommandLineDisable = 1

--Remove the plugin's <C-R> mapping in command-line mode, which intercepts the
--keypress and runs the plugin’s code instead of Neovim’s internal “insert
--register contents” function.
vim.api.nvim_del_keymap("c", "<C-R>")
