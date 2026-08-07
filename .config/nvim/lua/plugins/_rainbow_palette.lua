-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:00 CEST
-- Path:   ~/.config/nvim/lua/plugins/_rainbow_palette.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local M = {}

M.delimiter_highlight = {
  "RainbowRed",
  "RainbowYellow",
  "RainbowBlue",
  "RainbowOrange",
  "RainbowGreen",
  "RainbowViolet",
  "RainbowCyan",
}

M.indent_highlight = {
  "IndentRed",
  "IndentYellow",
  "IndentBlue",
  "IndentOrange",
  "IndentGreen",
  "IndentViolet",
  "IndentCyan",
}

function M.set_highlights()
  -- Brighter colors (brackets/delimiters)
  vim.api.nvim_set_hl(0, "RainbowRed",    { fg = "#e06c75" })
  vim.api.nvim_set_hl(0, "RainbowYellow", { fg = "#e5c07b" })
  vim.api.nvim_set_hl(0, "RainbowBlue",   { fg = "#61afef" })
  vim.api.nvim_set_hl(0, "RainbowOrange", { fg = "#d19a66" })
  vim.api.nvim_set_hl(0, "RainbowGreen",  { fg = "#98c379" })
  vim.api.nvim_set_hl(0, "RainbowViolet", { fg = "#c678dd" })
  vim.api.nvim_set_hl(0, "RainbowCyan",   { fg = "#56b6c2" })

  -- Brighter colors (vertical indent guides)
  --vim.api.nvim_set_hl(0, "IndentRed",    { fg = "#e06c75" })
  --vim.api.nvim_set_hl(0, "IndentYellow", { fg = "#e5c07b" })
  --vim.api.nvim_set_hl(0, "IndentBlue",   { fg = "#61afef" })
  --vim.api.nvim_set_hl(0, "IndentOrange", { fg = "#d19a66" })
  --vim.api.nvim_set_hl(0, "IndentGreen",  { fg = "#98c379" })
  --vim.api.nvim_set_hl(0, "IndentViolet", { fg = "#c678dd" })
  --vim.api.nvim_set_hl(0, "IndentCyan",   { fg = "#56b6c2" })

  -- Dimmer colors (vertical indent guides)
  --vim.api.nvim_set_hl(0, "RainbowRed",    { fg = "#c06c75" })
  --vim.api.nvim_set_hl(0, "RainbowYellow", { fg = "#c0a36e" })
  --vim.api.nvim_set_hl(0, "RainbowBlue",   { fg = "#5a9bd4" })
  --vim.api.nvim_set_hl(0, "RainbowOrange", { fg = "#b07d4f" })
  --vim.api.nvim_set_hl(0, "RainbowGreen",  { fg = "#7fae6b" })
  --vim.api.nvim_set_hl(0, "RainbowViolet", { fg = "#a47fbf" })
  --vim.api.nvim_set_hl(0, "RainbowCyan",   { fg = "#4aa8a0" })

  -- Even more dimm colors (vertical indent guides)
  vim.api.nvim_set_hl(0, "IndentRed",    { fg = "#8f5b62" })
  vim.api.nvim_set_hl(0, "IndentYellow", { fg = "#8f7a58" })
  vim.api.nvim_set_hl(0, "IndentBlue",   { fg = "#4f789c" })
  vim.api.nvim_set_hl(0, "IndentOrange", { fg = "#8a6647" })
  vim.api.nvim_set_hl(0, "IndentGreen",  { fg = "#65875c" })
  vim.api.nvim_set_hl(0, "IndentViolet", { fg = "#816397" })
  vim.api.nvim_set_hl(0, "IndentCyan",   { fg = "#4a7f7b" })
end

return M
