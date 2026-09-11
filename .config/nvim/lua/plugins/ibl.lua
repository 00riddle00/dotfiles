-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:43 CEST
-- Path:   ~/.config/nvim/lua/plugins/ibl.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "lukas-reineke/indent-blankline.nvim",
  main = "ibl",
  config = function()
    local hooks = require("ibl.hooks")
    local palette = require("config.rainbow_palette")

    hooks.register(hooks.type.HIGHLIGHT_SETUP, function()
      palette.set_highlights()
    end)

    palette.set_highlights()

    require("ibl").setup({
      enabled = false,
      indent = {
        char = "▏",
        highlight = palette.indent_highlight,
      },
      scope = {
        enabled = false,
      },
    })
  end,
}
