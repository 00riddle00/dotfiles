-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:42 CEST
-- Path:   ~/.config/nvim/lua/plugins/diffview.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  "sindrets/diffview.nvim",
  config = function()
    require("diffview").setup({
      hooks = {
        diff_buf_read = function()
          vim.cmd("norm! gg]ckzt") -- Set cursor on the first hunk.
        end,
        diff_buf_win_enter = function()
          vim.opt_local.foldlevel = 99
        end,
      },
    })
  end,
}
