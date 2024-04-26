-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-04-22 02:18:08 EEST
-- Path:   ~/.config/nvim/lua/plugins.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Load Packer (only applicable if packer is configured as `opt`)
vim.cmd [[packadd packer.nvim]]

-- Load

return require("packer").startup(function(use)
  -- Packer can manage itself as an optional plugin
  use { "wbthomason/packer.nvim" }
  use { "jlanzarotta/bufexplorer", config = function() require("plugins/bufexplorer") end }
  use { "github/copilot.vim", config = function() require("plugins/copilot") end }
  use { "raimondi/delimitmate", config = function() require("plugins/delimitmate") end }
  use { "preservim/nerdcommenter" }
  use { 'nvim-tree/nvim-tree.lua', requires = {{ 'nvim-tree/nvim-web-devicons' }}, config = function() require("plugins/nvim-tree") end }
  use { "nvim-treesitter/nvim-treesitter", run = function() local ts_update = require("nvim-treesitter.install").update({ with_sync = true }) ts_update() end, config = function() require("plugins/nvim-treesitter") end }
  use { "preservim/tagbar", config = function() require("plugins/tagbar") end }
  use { "nvim-telescope/telescope.nvim", requires = {{ "nvim-lua/plenary.nvim" }}, config = function() require("plugins/_telescope") end }
  use { "nvim-telescope/telescope-fzf-native.nvim", run = "make" }
  use { "vim-autoformat/vim-autoformat", config = function() require("plugins/vim-autoformat") end }
  use { "ryanoasis/vim-devicons" }
  use { "junegunn/vim-easy-align" }
  use { "easymotion/vim-easymotion", config = function() require("plugins/vim-easymotion") end }
  use { "houtsnip/vim-emacscommandline", config = function() require("plugins/vim-emacscommandline") end }
  use { "tpope/vim-fugitive" }
  use { "tpope/vim-repeat" }
  use { "tpope/vim-surround", requires = {{ "tpope/vim-repeat" }} }
  use { "christoomey/vim-tmux-navigator" }
  use { "lervag/vimtex", config = function() require("plugins/vimtex") end }
end)
