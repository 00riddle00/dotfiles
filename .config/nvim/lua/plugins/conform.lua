-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-18 01:25:26 CEST
-- Path:   ~/.config/nvim/lua/plugins/conform.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  "stevearc/conform.nvim",
  config = function()
    require("conform").setup({
      formatters_by_ft = {
        awk = { "gawk" },
        bash = { "shfmt" },
        javascript = { "prettier" },
        javascriptreact = { "prettier" },
        json = { "prettier" },
        lua = { "stylua" },
        markdown = { "prettier" },
        python = { "ruff_format" },
        -- python = { "black" },
        rust = { "rustfmt" },
        sh = { "shfmt" },
        tex = { "latexindent" },
        toml = { "tombi" },
        typescript = { "prettier" },
        typescriptreact = { "prettier" },
        yaml = { "prettier" },
      },

      -- Fall back to LSP formatting when no dedicated formatter is configured.
      default_format_opts = {
        lsp_format = "fallback",
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
