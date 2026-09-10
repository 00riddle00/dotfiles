-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-10 20:35:25 CEST
-- Path:   ~/.config/nvim/lua/config/filetypes.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

vim.filetype.add({
  extension = {
    asm = "tasm",
    ASM = "tasm",
    bat = "dosbatch",
    BAT = "dosbatch",
    bnf = "bnf",
    lst = "text",
  },
})
