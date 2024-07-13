-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-07-13 16:00:28 EEST
-- Path:   ~/.config/nvim/lua/plugins/nvim-tree.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("nvim-tree").setup({
  sort = {
    sorter = "case_sensitive",
  },
  view = {
    width = 30,
  },
  renderer = {
    group_empty = true,
  },
  filters = {
    dotfiles = true,
  },
})
