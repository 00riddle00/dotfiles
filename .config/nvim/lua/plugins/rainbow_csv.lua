-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-23 20:26:22 CEST
-- Path:   ~/.config/nvim/lua/plugins/rainbow_csv.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("rainbow_csv").setup({
  -- optional lazy-loading below
  module = {
    "rainbow_csv",
    "rainbow_csv.fns",
  },
  ft = {
    "csv",
    "tsv",
    "csv_semicolon",
    "csv_whitespace",
    "csv_pipe",
    "rfc_csv",
    "rfc_semicolon",
  },
})
