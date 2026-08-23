-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-23 20:26:10 CEST
-- Path:   ~/.config/nvim/lua/config/util.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

--- Neovim specific shortcuts
local vim = vim or {}
local api = vim.api

local Util = {}

Util.nvim_command = api.nvim_command
Util.user_command = api.nvim_create_user_command
Util.nvim_call_function = api.nvim_call_function

-- Check if a file or directory exists in this path
function Util.exists(path)
  return io.open(path, "r") and true or false
end

-- Create directory if it does not exist yet
function Util.mkdir(path)
  if Util.exists(path) then
    return false
  end
  return os.execute("mkdir " .. path) and true or false
end

function Util.getPath(str)
  local s = str:gsub("%-", "")
  return s:match("(.*[/\\])")
end

function Util.noop() --[[ do nothing ]]
end

-- Slice table as this is not included in lua 5.1
function Util.tbl_slice(tbl, start_idx, end_idx)
  local slice = {}
  end_idx = end_idx or #tbl

  for idx = start_idx, end_idx do
    table.insert(slice, tbl[idx])
  end

  return slice
end

-- Show confirm dialog before executing predicate
function Util.confirm(options, msg)
  local defaults = { Yes = Util.noop, No = Util.noop }
  msg = msg or "Are you sure ?"
  options = options or defaults

  local option_tbl = {}
  local callback_tbl = {}

  for option, callback in pairs(options) do
    table.insert(option_tbl, "&" .. option)
    table.insert(callback_tbl, callback)
  end

  local option_str = table.concat(option_tbl, "\n")

  local choice = vim.fn.confirm(msg, option_str)
  local choice_func = callback_tbl[choice]

  if choice and choice_func and type(choice_func) == "function" then
    choice_func()
  end
end

-- Check if the current directory is a git repo
function Util.ensure_git()
  if os.execute("git rev-parse --is-inside-work-tree 2>/dev/null") ~= 0 then
    error("Not a git repository")
  end
end

local function map(mode, key, action, options, buffer)
  options = options or {}

  local default_opts = { silent = true }
  local opts = vim.tbl_extend("force", default_opts, options)

  if buffer then
    opts.buffer = true
  end

  vim.keymap.set(mode, key, action, opts)
end

local function unmap(mode, key, buffer)
  if buffer then
    pcall(vim.keymap.del, mode, key, { buffer = 0 })
  else
    pcall(vim.keymap.del, mode, key)
  end
end

function Util.nmap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { noremap = false })
  map("n", key, action, opts, buffer)
end

function Util.nnoremap(key, action, options, buffer)
  map("n", key, action, options, buffer)
end

function Util.tnoremap(key, action, options, buffer)
  map("t", key, action, options, buffer)
end

function Util.imap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { noremap = false })
  map("i", key, action, opts, buffer)
end

function Util.inoremap(key, action, options, buffer)
  map("i", key, action, options, buffer)
end

function Util.xnoremap(key, action, options, buffer)
  map("x", key, action, options, buffer)
end

function Util.vmap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { noremap = false })
  map("v", key, action, opts, buffer)
end

function Util.xmap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { noremap = false })
  map("x", key, action, opts, buffer)
end

function Util.vnoremap(key, action, options, buffer)
  map("v", key, action, options, buffer)
end

function Util.noremap(key, action, options, buffer)
  map("", key, action, options, buffer)
end

function Util.nunmap(key, buffer)
  unmap("n", key, buffer)
end

function Util.iunmap(key, buffer)
  unmap("i", key, buffer)
end

function Util.vunmap(key, buffer)
  unmap("v", key, buffer)
end

function Util.xunmap(key, buffer)
  unmap("x", key, buffer)
end

function Util.tunmap(key, buffer)
  unmap("t", key, buffer)
end

return Util
