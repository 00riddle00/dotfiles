-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:44 CEST
-- Path:   ~/.config/nvim/lua/plugins/markdown_table_mode.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

-- Run :Mtm to toggle Markdown table mode.
return {
  "Kicamon/markdown-table-mode.nvim",
  config = function()
    require("markdown-table-mode").setup({
      filetype = {
        "*.md",
        "*.sql",
      },
      options = {
        insert = true, -- When typing "|".
        insert_leave = true, -- When leaving insert mode.
        pad_separator_line = true, -- Add space in separator line.
        alig_style = "default", -- default, left, center, right
      },
    })
  end,
}
