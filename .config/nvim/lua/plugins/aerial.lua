-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:40 CEST
-- Path:   ~/.config/nvim/lua/plugins/aerial.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  "stevearc/aerial.nvim",
  opts = {
    layout = {
      max_width = { 40, 0.3 },
      min_width = 20,
    },
    show_guides = true,
    filter_kind = false, -- Show everything.
    -- filter_kind = {
    --   "Class",
    --   "Constructor",
    --   "Enum",
    --   "Function",
    --   "Interface",
    --   "Module",
    --   "Method",
    --   "Struct",
    --   "Variable",
    --   "Field",
    --   "Property",
    --   "Constant",
    -- },
  },
  dependencies = {
    "nvim-treesitter/nvim-treesitter",
    "nvim-tree/nvim-web-devicons",
  },
}
