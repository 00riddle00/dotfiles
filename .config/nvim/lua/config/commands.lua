-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-09 17:11:48 CEST
-- Path:   ~/.config/nvim/lua/config/commands.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local Util = require("config.util")

local command = Util.user_command

command("W", "write", {})
command("CD", "cd %:p:h", {})

command("Bin", "%!xxd -b -c 8", {})
command("Hex", "%!xxd -c 16 -g 1 -u", {})
command("HexRevert", "%!xxd -c 16 -r", {})
command("ReHex", "HexRevert", {})
command("HexDump", "%!hexdump -C", {})

command("FFunix", "e ++ff=unix", {})
command("FFdos", "e ++ff=dos", {})
command("VER", "windo wincmd H", {})
command("HOR", "windo wincmd K", {})

-- Sort by Markdown H1 headings
--   "@" character should not appear in a file before running replace
--   "\n" with "@" (except the newlines appearing before "# ").
--   Sorts the file, then restores newlines.
command("SortPa", function()
  vim.cmd("%s/\\n\\(# \\)\\@!/@/g")
  vim.cmd("sort")
  vim.cmd("%s/@/\\r/g")
end, {})

command("WE", function(opts)
  vim.cmd("write " .. opts.args)
  vim.cmd("edit " .. opts.args)
end, { nargs = 1 })

command("GB", "lua require('gitsigns').blame_line({ full = true })", {})

-- Bufferize: Run any command and capture its output in a new buffer.
-- Usage:
--   :Bufferize messages, :Bufferize map, :Bufferize highlight, etc.
-- Output lands in a scratch buffer you can search, yank from, and close  with q or :bd.
command("Bufferize", function(opts)
  local output = vim.api.nvim_exec2(opts.args, { output = true })
  vim.cmd("new")
  vim.bo.buftype = "nofile"
  vim.bo.swapfile = false
  vim.bo.bufhidden = "wipe"
  vim.api.nvim_buf_set_lines(0, 0, -1, false, vim.split(output.output, "\n"))
end, { nargs = "+", complete = "command" })

command("UpdateHeader", function()
  local date = vim.fn.trim(vim.fn.system("date '+%F %T %Z'"))
  local fname = vim.api.nvim_buf_get_name(0)
  local raw = vim.fn.system("readlink -f " .. vim.fn.shellescape(fname))
  local path = vim.fn.trim(
    vim.fn.system(
      "echo "
        .. vim.fn.shellescape(raw)
        .. " | sed -E 's|^"
        .. vim.env.HOME
        .. "|~|'"
    )
  )

  -- accept ; # / * - and spaces as the comment markers
  local prefix_cls = "[;%#/%%*%-%s]"

  for i = 1, 30 do
    local l = vim.api.nvim_buf_get_lines(0, i - 1, i, false)[1]
    if not l then
      break
    end

    if l:match(prefix_cls .. "+Date:") then
      local new = l:gsub("^(%s*" .. prefix_cls .. "*Date:%s*).*", "%1" .. date)
      vim.api.nvim_buf_set_lines(0, i - 1, i, false, { new })
    elseif l:match(prefix_cls .. "+Path:") then
      local new = l:gsub("^(%s*" .. prefix_cls .. "*Path:%s*).*", "%1" .. path)
      vim.api.nvim_buf_set_lines(0, i - 1, i, false, { new })
    end
  end
end, {
  desc = "Refresh header Date and Path (lines 1–30), supports ; # /* - comments",
})
