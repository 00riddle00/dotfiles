-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-09 17:11:53 CEST
-- Path:   ~/.config/nvim/lua/config/util.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Neovim-specific shortcuts.
local vim = vim or {}
local api = vim.api

local Util = {}

Util.nvim_command = api.nvim_command
Util.user_command = api.nvim_create_user_command
Util.nvim_call_function = api.nvim_call_function

-- Check whether a file or directory exists at the given path.
function Util.exists(path)
  return io.open(path, "r") and true or false
end

-- Create a directory if it does not exist yet.
function Util.mkdir(path)
  if Util.exists(path) then
    return false
  end
  return os.execute("mkdir " .. path) and true or false
end

-- Extract the directory portion of a path after removing hyphens.
function Util.getPath(str)
  local s = str:gsub("%-", "")
  return s:match("(.*[/\\])")
end

-- No-op callback for places where a callable function is required.
function Util.noop()
end

-- Slice a table, as this is not included in Lua 5.1.
function Util.tbl_slice(tbl, start_idx, end_idx)
  local slice = {}
  end_idx = end_idx or #tbl

  for idx = start_idx, end_idx do
    table.insert(slice, tbl[idx])
  end

  return slice
end

-- Show a confirmation dialog before executing the selected callback.
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

-- Ensure the current directory is inside a Git repository.
function Util.ensure_git()
  if os.execute("git rev-parse --is-inside-work-tree 2>/dev/null") ~= 0 then
    error("Not a git repository")
  end
end

-- Define a keymap with silent mode enabled by default.
local function map(mode, key, action, options, buffer)
  options = options or {}

  local default_opts = { silent = true }
  local opts = vim.tbl_extend("force", default_opts, options)

  if buffer then
    opts.buffer = true
  end

  vim.keymap.set(mode, key, action, opts)
end

-- Delete a keymap, optionally only for the current buffer.
local function unmap(mode, key, buffer)
  if buffer then
    pcall(vim.keymap.del, mode, key, { buffer = 0 })
  else
    pcall(vim.keymap.del, mode, key)
  end
end

-- Vim-style mapping wrappers; *map variants are recursive and *noremap
-- variants are nonrecursive.
function Util.nmap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { remap = true })
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
  local opts = vim.tbl_extend("force", options, { remap = true })
  map("i", key, action, opts, buffer)
end

function Util.inoremap(key, action, options, buffer)
  map("i", key, action, options, buffer)
end

function Util.xnoremap(key, action, options, buffer)
  map("x", key, action, options, buffer)
end

function Util.onoremap(key, action, options, buffer)
  map("o", key, action, options, buffer)
end

function Util.vmap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { remap = true })
  map("v", key, action, opts, buffer)
end

function Util.xmap(key, action, options, buffer)
  options = options or {}
  local opts = vim.tbl_extend("force", options, { remap = true })
  map("x", key, action, opts, buffer)
end

function Util.vnoremap(key, action, options, buffer)
  map("v", key, action, options, buffer)
end

function Util.noremap(key, action, options, buffer)
  map("", key, action, options, buffer)
end

-- Vim-style mapping deletion wrappers.
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
