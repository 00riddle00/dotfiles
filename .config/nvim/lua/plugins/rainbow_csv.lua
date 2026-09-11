-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:46 CEST
-- Path:   ~/.config/nvim/lua/plugins/rainbow_csv.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "cameron-wags/rainbow_csv.nvim",
  config = function()
    require("rainbow_csv").setup({
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
  end,
}
