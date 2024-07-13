-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-07-13 15:59:57 EEST
-- Path:   ~/.config/nvim/lua/plugins/_telescope.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("telescope").setup{
  defaults = {
    layout_strategy = "flex",
    mappings = {
      i = {
        -- close in insert mode
        ["<esc>"] = require("telescope.actions").close
      }
    }
  }
}

require("telescope").load_extension("fzf")
