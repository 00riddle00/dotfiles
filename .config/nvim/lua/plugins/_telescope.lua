-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:07 CEST
-- Path:   ~/.config/nvim/lua/plugins/_telescope.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local telescope = require("telescope")

telescope.setup({
  defaults = {
    layout_strategy = "flex",
    sorting_strategy = "ascending",
    layout_config = {
      prompt_position = "top",
      -- width = 0.45,
      -- height = 0.52,
    },
    mappings = {
      i = {
        ["<esc>"] = require("telescope.actions").close,
      },
    },
  },
  extensions = {
    ["ui-select"] = {
      require("telescope.themes").get_dropdown({}),
    },
  },
})

telescope.load_extension("fzf")
telescope.load_extension("ui-select")
