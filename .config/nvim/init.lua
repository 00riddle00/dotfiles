-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-09 17:11:44 CEST
-- Path:   ~/.config/nvim/init.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Set the leader before loading lazy.nvim or defining any <leader> mappings.
vim.g.mapleader = "\\"
vim.g.maplocalleader = ","

require("config.lazy")
require("config.keybindings")
require("config.autocmd")
require("config.commands")
require("config.options")
