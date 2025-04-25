-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2025-04-24 12:50:28 EEST
-- Path:   ~/.config/nvim/lua/plugins/rainbow_csv.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("rainbow_csv").setup {
  -- optional lazy-loading below
  module = {
    "rainbow_csv",
    "rainbow_csv.fns"
  },
  ft = {
    "csv",
    "tsv",
    "csv_semicolon",
    "csv_whitespace",
    "csv_pipe",
    "rfc_csv",
    "rfc_semicolon"
  }
}
