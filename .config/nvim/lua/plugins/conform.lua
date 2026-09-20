-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-20 22:33:18 CEST
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
        -- StyLua uses ~/.config/nvim/stylua.toml for Neovim Lua files; it is
        -- not a global fallback config for Lua files outside ~/.config/nvim.
        lua = { "stylua" },
        markdown = { "prettier" },
        -- Ruff falls back to ~/.config/ruff/ruff.toml when no project config
        -- exists.
        python = { "ruff_format" },
        -- python = { "black" },
        rust = { "rustfmt" },
        sh = { "shfmt" },
        tex = { "latexindent" },
        toml = { "tombi" },
        typescript = { "prettier" },
        typescriptreact = { "prettier" },
        yaml = { "prettier" },
        -- Use the Zsh dialect while keeping the same shfmt style options as
        -- Bash.
        zsh = { "shfmt_zsh" },
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
            "--prose-wrap",
            "always",
            "--tab-width",
            "2",
            "--no-use-tabs",
            "--no-semi",
          },
        },
        shfmt = {
          append_args = {
            "-ln=bash",
            "-s",
            "-i",
            "2",
            "-bn",
            "-ci",
            "-sr",
          },
        },
        shfmt_zsh = {
          inherit = "shfmt",
          append_args = {
            "-ln=zsh",
            "-s",
            "-i",
            "2",
            "-bn",
            "-ci",
            "-sr",
          },
        },
      },
    })
  end,
}
