-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:51 CEST
-- Path:   ~/.config/nvim/lua/plugins/virtcolumn.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "xiyaowong/virtcolumn.nvim",
  config = function()
    vim.g.virtcolumn_char = "▕"
    -- vim.g.virtcolumn_char = "│"
  end,
}
