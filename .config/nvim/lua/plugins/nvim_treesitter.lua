-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:46 CEST
-- Path:   ~/.config/nvim/lua/plugins/nvim_treesitter.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "nvim-treesitter/nvim-treesitter",
  lazy = false,
  build = ":TSUpdate",
  config = function()
    local ts = require("nvim-treesitter")

    ts.setup()

    local ensure_installed = {
      "bash",
      "c",
      "css",
      "html",
      "javascript",
      "json",
      "latex",
      "lua",
      "markdown",
      "markdown_inline",
      "python",
      "query",
      "r",
      "regex",
      "sql",
      "toml",
      "vim",
      "vimdoc",
      "xml",
      "yaml",
    }

    ts.install(ensure_installed)
  end,
}
