-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-11-25 02:00:45 EET
-- Path:   ~/.config/nvim/lua/plugins/rainbow_csv.lua
-- URL:    https://github.com
-------------------------------------------------------------------------------

local csv_ft = {
  "csv",
  "tsv",
  "csv_semicolon",
  "csv_whitespace",
  "csv_pipe",
  "rfc_csv",
  "rfc_semicolon",
}

return {
  "cameron-wags/rainbow_csv.nvim",
  ft = csv_ft,
  config = function()
    require("rainbow_csv").setup()

    -- Remove global :Update and :update abbreviation created in setup() so
    -- :UpdateHeader stays first in completion and :update saves normally.
    pcall(vim.api.nvim_del_user_command, "Update")
    vim.cmd("silent! cunabbrev update")
  end,
}
