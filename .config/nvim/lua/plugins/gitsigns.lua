-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:16 CEST
-- Path:   ~/.config/nvim/lua/plugins/gitsigns.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("gitsigns").setup({
  current_line_blame = false,
  current_line_blame_formatter = "<author>, <author_time:%Y-%m-%d %H:%M>",
  worktrees = {
    {
      toplevel = vim.env.HOME,
      gitdir = vim.env.HOME .. "/.dotfiles",
    },
  },
})
