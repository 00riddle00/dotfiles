-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-14 00:42:37 CEST
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
        javascript = { "prettier" },
        javascriptreact = { "prettier" },
        typescript = { "prettier" },
        typescriptreact = { "prettier" },
        lua = { "stylua" },
      },
      formatters = {
        --[[
        black = {
          prepend_args = {
            "--line-length",
            "88",
            "--preview",
            "--enable-unstable-feature=string_processing",
          },
        },
        --]]
        prettier = {
          -- These CLI options override project-local Prettier configuration
          -- such as .prettierrc files, so change or extend them with care.
          prepend_args = {
            "--print-width",
            "80",
            "--tab-width",
            "2",
            "--no-use-tabs",
            "--no-semi",
          },
        },
      },
    })
  end,
}
