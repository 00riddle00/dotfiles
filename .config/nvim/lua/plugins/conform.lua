-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:41 CEST
-- Path:   ~/.config/nvim/lua/plugins/conform.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  "stevearc/conform.nvim",
  config = function()
    require("conform").setup({
      formatters_by_ft = {
        python = { "ruff_format" },
        -- python = { "black" },
        lua = { "stylua" },
      },
      -- formatters = {
      --   black = {
      --     prepend_args = {
      --       "--line-length", "88",
      --       "--preview",
      --       "--enable-unstable-feature=string_processing",
      --     },
      --   },
      -- },
    })
  end,
}
