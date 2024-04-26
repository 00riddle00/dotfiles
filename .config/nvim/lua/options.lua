-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-04-22 02:18:05 EEST
-- Path:   ~/.config/nvim/lua/options.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Meta accessors for vim options {{{
    local o = vim.opt
--  local bo = vim.bo
--  local wo = vim.wo
--  local fn = vim.fn
-- }}}

-- In Arch linux, Neovim reads the /etc/xdg/nvim/sysinit.vim,
-- which sources /usr/share/nvim/archlinux.vim. This makes pacman-installed
-- global Arch Linux vim packages work.

-------------------------------------------
-- Netrw
-------------------------------------------
-- disable netrw
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-------------------------------------------
-- Colors
-------------------------------------------

vim.cmd [[colorscheme $VIMCOLOR]]
o.background = "dark"
o.termguicolors = false

-------------------------------------------
-- Appearance
-------------------------------------------

-- Number of screen lines to use for the command-line.
o.cmdheight = 1
-- Show count of selected lines or characters
o.showcmd = true
-- Show line numbers
o.number = true
-- Always show statusline
o.laststatus = 2
-- Set relative line numbering
o.relativenumber = true
-- show the line number on the bar
o.ruler = true
-- Vertical separator style, and do not show the tildes at the end of buffer
o.fillchars = { vert = "|", eob = " " }
-- kudos to Jason Ryan (http://jasonwryan.com)
-- (last element in statusline - escaped space character,
--  do not remove it when removing trailing spaces from a file)
local stl = {
    " %f%m%r%h%w", " ::", " %y", " [%{&ff}]",
    " %{&fileencoding?&fileencoding:&encoding}%=",
    " %c", " [%p%%: %l/%L]"
}
o.statusline = table.concat(stl)

-------------------------------------------
-- Displaying text
-------------------------------------------

--Set character encoding used inside Vim
o.encoding = "utf-8"
--Set character encoding for the current buffer.
o.fileencoding = "utf-8"
-- Enable syntax highlighting
vim.cmd [[syntax enable]]
-- Do not fold text/code
o.foldenable = false
-- Do not wrap lines
o.wrap = false
-- Spelling
o.spelllang = { "en_gb", "lt" }

-------------------------------------------
-- Editing text
-------------------------------------------

-- Text wrapping
o.textwidth = 199 -- temporary setting
-- Auto/smart indent
o.autoindent = true
o.smartindent = true

-------------------------------------------
-- Cursor movement
-------------------------------------------

-- Cursor movement behaviour
o.startofline = false
-- Jump 5 lines when running out of the screen
o.scrolljump = 5
-- Indicate "running out of the screen" when 3 lines before end of the screen
o.scrolloff = 4
-- Scroll horizontally 5 chars when running out of the screen
o.sidescroll = 5
-- Indicate "running out of the screen" when 8 chars before end of the screen
o.sidescrolloff = 8
-- Show matching brackets when cursor is over them
o.showmatch = true

-------------------------------------------
-- Mouse
-------------------------------------------

-- Set mouse to work in all modes
o.mouse = "a"

-------------------------------------------
-- Buffers
-------------------------------------------

-- Allow to skip between buffers without writing or abandoning changes
o.hidden = true

-------------------------------------------
-- Windows
-------------------------------------------

-- open the new window below the current one for horizontal splits,
-- and to the right of the current one for vertical splits.
o.splitright = true
o.splitbelow = true

-------------------------------------------
-- Clipboard
-------------------------------------------

o.clipboard = "unnamed"

-------------------------------------------
-- Search
-------------------------------------------

-- search ignoring case
o.ignorecase = true
-- incremental search
o.incsearch = true
-- do not highlight the search
o.hlsearch = false
-- Override the "ignorecase" option if the search pattern contains upper case
-- characters.
o.smartcase = true
-- Not including "S" shows search count message when searching, e.g. "[1/5]"
o.shortmess = "filnxtToOFcI"

-------------------------------------------
-- Wildcards
-------------------------------------------

o.wildignore = { "*.pyc", "build", "__pycache__", "venv" }

-------------------------------------------
-- Autocomplete
-------------------------------------------

-- Scan only opened buffers and current file, makes autocompletion faster.
o.complete = ".,w,b,u"

-------------------------------------------
-- Tags
-------------------------------------------

-- set tags location
o.tags = "./tags,tags;$HOME"

-------------------------------------------
-- Shell
-------------------------------------------

o.shell = "/bin/zsh"

-------------------------------------------
-- Backups
-------------------------------------------

-- Do not save backups
o.backup = false
-- Do not use swap file
o.swapfile = false

-------------------------------------------
-- Spaces
-------------------------------------------

-- How much spaces to autoindent
-- shiftwidth governs indentation via >>, <<
o.shiftwidth = 4

-- show spaces as "."
-- enable with ":set list"
o.listchars:append("space:.")

-------------------------------------------
-- Tabs
-------------------------------------------

-- Use the appropriate number of spaces to insert a <Tab>
o.expandtab = true
-- Number of spaces that a <Tab> in the file counts for.
o.tabstop = 4

-- Number of spaces that a <Tab> counts for while
-- performing editing operations, like inserting
-- a <Tab> or using <BS>.
o.softtabstop = 4

-- show tabs as "|___"
-- enable with ":set list"
o.listchars:append("tab:|_,extends:>,precedes:<,nbsp:+")
