-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-07-13 16:00:38 EEST
-- Path:   ~/.config/nvim/lua/plugins/vim-autoformat.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

vim.g.python3_host_prog = "/usr/bin/python3"
vim.g.formatterpath = { "/usr/bin/black", "/usr/bin/yapf" }
vim.g.autoformat_autoindent = 0
vim.g.autoformat_retab = 0
vim.g.autoformat_remove_trailing_spaces = 0
vim.g.formatter_yapf_style = "pep8"
