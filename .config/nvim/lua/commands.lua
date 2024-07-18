-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-07-18 16:25:53 EEST
-- Path:   ~/.config/nvim/lua/commands.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local Util = require("util")

local command = Util.user_command

command("W", "write", {})

command("Bin", "%!xxd -b -c 8", {})
command("Hex", "%!xxd -c 16 -g 1 -u", {})
command("HexRevert", "%!xxd -c 16 -r", {})
command("ReHex", "HexRevert", {})
command("HexDump", "%!hexdump -C", {})

command("FFunix", "e ++ff=unix", {})
command("FFdos", "e ++ff=dos", {})

-- Sort by Markdown H1 headings
--   "@" character should not appear in a file before running replace
--   "\n" with "@" (except the newlines appearing before "# ").
--   Sorts the file, then restores newlines.
command("SortPa", function()
  vim.cmd("%s/\\n\\(# \\)\\@!/@/g")
  vim.cmd("sort")
  vim.cmd("%s/@/\\r/g")
end, {})
