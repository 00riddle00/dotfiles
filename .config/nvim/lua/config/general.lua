-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:00:27 CEST
-- Path:   ~/.config/nvim/lua/config/general.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local Util = require("config.util")

local mkdir = Util.mkdir
local cmd   = Util.nvim_command

local General = {}

-- NOTE: Inspired by a similar function in Damian Conway's vimrc
-- SOURCE: https://github.com/thoughtstream/Damian-Conway-s-Vim-Setup/blob/master/.vimrc
function General.EnsureDirExists()
  local required_dir = vim.fn.expand("%:h")

  if not Util.exists(required_dir) then
    Util.confirm({
      create = Util.noop,
      quit = function() cmd("exit") end
    }, "Parent directory '" .. required_dir .. "' doesn't exist.")

    if not mkdir(required_dir) then
      Util.confirm({
        Quit = function() cmd("exit") end,
        Continue = ""
      }, "Can't create '" .. required_dir .. "'")
    end
  end
end

function General.Preserve(callback)
  -- Preparation: save last search, and cursor position.
  local search = vim.fn.getreg("/")
  local line   = vim.fn.line(".")
  local col    = vim.fn.col(".")

  -- Do the business unless filetype is blacklisted
  local blacklist = {"sql", "csv", "tcsv", "tsv", "ttsv"}

  local in_blacklist = false
  for _, value in pairs(blacklist) do
    if value == vim.bo.filetype then
      in_blacklist = true
    end
  end

  if in_blacklist == false then
    callback()
  end

  -- Clean up: restore previous search history, and cursor position
  vim.fn.setreg("/", search)
  vim.fn.cursor(line, col)
end

return General
