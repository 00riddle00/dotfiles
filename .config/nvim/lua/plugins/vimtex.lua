-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-12 00:11:50 CEST
-- Path:   ~/.config/nvim/lua/plugins/vimtex.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "lervag/vimtex",
  config = function()
    -- Set the VimTeX PDF viewer using the generic viewer interface.
    vim.g.vimtex_view_general_viewer = "zathura"

    -- Use XeLaTeX as the default latexmk engine.
    vim.g.vimtex_compiler_latexmk_engines = {
      ["_"] = "-xelatex",
    }

    -- Ignore common underfull and overfull warnings in VimTeX's quickfix list.
    vim.g.vimtex_quickfix_ignore_filters = {
      "Underfull",
      "Overfull",
    }
  end,
}
