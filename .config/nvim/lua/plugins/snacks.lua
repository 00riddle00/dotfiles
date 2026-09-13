-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-14 00:46:45 CEST
-- Path:   ~/.config/nvim/lua/plugins/snacks.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  "folke/snacks.nvim",
  priority = 1000,
  lazy = false,
  opts = {
    -- View Snacks notification history with
    -- `:lua Snacks.notifier.show_history()`.
    -- Not all Neovim messages go through the notifier; some are still shown in
    -- standard command-line/message area and can be reviewed with `:messages`.
    notifier = { enabled = true },
    quickfile = { enabled = true },
    words = { enabled = not vim.g.vscode },
  },
}
