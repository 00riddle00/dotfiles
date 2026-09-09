-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-09 17:11:51 CEST
-- Path:   ~/.config/nvim/lua/config/keybindings.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local Util = require("config.util")

local nmap = Util.nmap
local vmap = Util.vmap
local imap = Util.imap

local inoremap = Util.inoremap
local nnoremap = Util.nnoremap
local vnoremap = Util.vnoremap
local xnoremap = Util.xnoremap
local onoremap = Util.onoremap

-------------------------------------------
-- General
-------------------------------------------

nnoremap("ss", [[:wq<CR>]])
nnoremap("qq", [[:q<CR>]])
nnoremap("<C-s>", [[:w!<CR>]])
nnoremap("<F5>", [[:cnext<CR>]])
nnoremap("<S-F5>", [[:cprevious<CR>]])
nnoremap("<C-F5>", [[:cc<CR>]])
--nmap("<leader>d", [[:pwd<CR>]])
nnoremap("<leader>h", [[:set hlsearch!<CR>]])

--nmap("<leader>n", [[:set relativenumber!<CR>]])

-- Enable both absolute and relative numbers
nnoremap("<leader>n", function()
  vim.opt.number = true
  vim.opt.relativenumber = true
end)

-- Disable both absolute and relative numbers
nnoremap("<leader>N", function()
  vim.opt.relativenumber = false
  vim.opt.number = false
end)

nnoremap("<leader>p", [[:setlocal paste!<CR>]])
--nmap("<leader>s", [[:split<CR>]])
--nmap("<leader>v", [[:vsplit<CR>]])
nnoremap("<leader>e", [[:edit<CR>]])
--nmap("<leader>u", [[:!urlview %<CR>]])
--inoremap("jk",    [[<esc>]]) -- "<C-[>" does the same

-- Disable key for entering Ex-mode
nnoremap("Q", "")

--Disable F1 built-in help key
nnoremap("<F1>", "")
inoremap("<F1>", "")

-- Set textwidth to 79 characters
nnoremap("<leader>8", [[:set textwidth=79<CR>]])

-- Set textwidth to 88 characters
nnoremap("<leader>0", [[:set textwidth=88<CR>]])

-- Set textwidth to 100 characters
nnoremap("<leader>1", [[:set textwidth=100<CR>]])

-- Toggle showing all white spaces as characters
nnoremap("<leader>l", [[:set list!<CR>]])

-- Replace {more than one blank lines} with {exactly one blank line}
--nmap("<leader>l", [[:%s/\(\n\n\)\n\+/\1/g<CR> <C-o>]])
--
-- :%s#\s\+$##e<CR><C-o>
-- :%s/\(\n\n\)\n\+/\1/e<CR><C-o>
-- :%s#\($\n\s*\)\+\%$##e<CR><C-o>
--
-- Explanation:
-- $\n - Match a new line (end-of-line character followed by a carriage return).
-- \s* - Allow any amount of whitespace on this new line
-- \+  - Allow any number of occurrences of this group (one or more).
-- \%$ - Match the end of the file

-------------------------------------------
-- Comments
-------------------------------------------

-- Get Alt + F1, sent from Alacritty, in the form of <F49>
nmap("<F49>", "gccj0")
vmap("<F49>", "gcj0")
imap("<F49>", "<Esc>gccj0")

-- Alt + F1
nmap("<M-F1>", "gccj0")
vmap("<M-F1>", "gcj0")
imap("<M-F1>", "<Esc>gccj0")

-- Vim registers <C-/> as <C-_>
nmap("<C-_>", "gccj0")
vmap("<C-_>", "gcj0")

-------------------------------------------
-- Emacs-like insert mode
-------------------------------------------

-- Motion
inoremap("<C-f>", [[<Right>]])
inoremap("<C-b>", [[<Left>]])

inoremap("<M-f>", [[<S-Right>]])
inoremap("<M-b>", [[<S-Left>]])

inoremap("<C-a>", [[<Home>]])
inoremap("<C-e>", [[<End>]])

inoremap("<C-p>", [[<Up>]])
inoremap("<C-n>", [[<Down>]])

-- Kill
inoremap("<C-d>", [[<Del>]])
-- <C-h> - already works.

inoremap("<M-d>", [[<Esc>ldwi]])
-- <C-w> - already works.

inoremap("<C-k>", [[<Esc>lDa]])
-- <C-u> - already works.

inoremap("<C-g>", [[<Esc>cc]])

-- Yank
inoremap("<C-y>", [[<C-r>"]])

-- Undo (vim registers <C-/> as <C-_>)
inoremap("<C-_>", [[<C-O>u]])

-- Transpose chars
--inoremap("<C-t>", [[<ESC>hxpa]])

-- Transpose words (very fragile)
inoremap("<C-t>", [[<ESC>BB"xdiWdWep"xpa]])

-------------------------------------------
-- <TAB> character in insert mode
-------------------------------------------

-- Smart <Tab> and <S-Tab>
inoremap("<Tab>", function()
  if vim.snippet and vim.snippet.active({ direction = 1 }) then
    vim.snippet.jump(1)
    return ""
  end

  -- Accept Copilot only if visible; otherwise real Tab.
  local ok, s = pcall(require, "copilot.suggestion")
  if ok and s.is_visible() then
    s.accept()
    return ""
  end

  return "<Tab>"
end, { expr = true })

inoremap("<S-Tab>", function()
  if vim.snippet and vim.snippet.active({ direction = -1 }) then
    vim.snippet.jump(-1)
    return ""
  end

  return "<S-Tab>"
end, { expr = true })
-------------------------------------------
-- Command-line mode
-------------------------------------------

-- See :help Command-line-mode
--     :help command-line-window

-- Not to be confused with Ex mode (see :help ex-mode)

-- <Up>   - previous command in history
-- <Down> - next command in history

-- <C-r>{register} - insert the contents of a numbered or named register
-- <C-r>" - insert the unnamed register, containing the text of the last delete
--          or yank
-- <C-r>* - insert the primary clipboard contents (X11: primary selection)
-- <C-r>+ - insert the secondary clipboard contents
-- <C-r>/ - insert the last search pattern
-- <C-r>: - insert the last command-line
-- <C-r>% - insert the current file name

-- q: — open with a command history from normal mode
-- q/ — open with a search history from normal mode (to search forward)
-- q? — open with a search history from normal mode (to search backward)
-- <C-f> — open with a command history from command mode

-- <C-w> - delete the |word| before the cursor.
-- <C-u> - remove all characters between the cursor position and the beginning
--         of the line
-- <C-c> - close command line window (if open) or return to normal mode

-------------------------------------------
-- [Windows] navigation
-------------------------------------------

-- If vim-tmux-navigator plugin is used, these
-- mappings need to be commented out.
--nmap("<C-k>", [[<C-W>k]])
--nmap("<C-j>", [[<C-W>j]])
--nmap("<C-l>", [[<C-W>l]])
--nmap("<C-h>", [[<C-W>h]])

-------------------------------------------
-- [Windows] resize
-------------------------------------------

nnoremap("<C-Up>", [[:resize -2<CR>]])
nnoremap("<C-Down>", [[:resize +2<CR>]])
nnoremap("<C-Left>", [[:vertical resize -2<CR>]])
nnoremap("<C-Right>", [[:vertical resize +2<CR>]])

-------------------------------------------
-- [Windows] layout
-------------------------------------------

-- Change 2 split windows from vert to horiz or horiz to vert
nnoremap("<leader>tv", [[<C-w>t<C-w>H]])
nnoremap("<leader>th", [[<C-w>t<C-w>K]])

-------------------------------------------
-- Tabs (layout)
-------------------------------------------

nnoremap("tt", [[:tabnew<CR>]])
nnoremap("t0", [[:tabfirst<CR>]])
nnoremap("t$", [[:tablast<CR>]])
nnoremap("te", [[:tabedit %<CR>]])
nnoremap("th", [[gT]])
nnoremap("tl", [[gt]])

-------------------------------------------
-- In-buffer navigation
-------------------------------------------

-- Move between buffers
nnoremap("<leader>]", [[:bnext<CR>]])
nnoremap("<leader>[", [[:bprevious<CR>]])

-- Treat long lines as break lines
nnoremap("j", [[gj]])
nnoremap("k", [[gk]])

-- Scroll half screen to left and right horizontally
nnoremap("zh", [[zH]])
nnoremap("zl", [[zL]])

-- Positions the current line at the bottom of the window
nnoremap("zz", [[z-]])

-------------------------------------------
-- Editing
-------------------------------------------

nnoremap("<leader>c", [[:%s/\n\n\n\+/\r\r/g<CR>]])

-------------------------------------------
-- Clipboard
-------------------------------------------

-- Yank into the system secondary clipboard register
vnoremap("<C-c>", [["+y]])
vnoremap("Y", [["+y]])
nnoremap("Y", [["+yy]])
nnoremap("YY", [["+yy]])
vnoremap("D", [["+D]])

-- Yank into the system secondary clipboard register and delete the visually
-- selected text.
--vmap("<C-x>", [["+c]])

-- Paste from the system secondary clipboard register and enter insert mode
-- right after.
--nmap("<C-v>", [[<ESC>"+pa]])

-- Paste from the system primary clipboard register (X11: primary selection)
-- (works for multiline indented text - as if "paste" option has been set)
--nmap("to", [[:r !xsel<CR>]])

-- Paste from system secondary clipboard register
-- (works for multiline indented text - as if "paste" option has been set)
nnoremap("tp", [[:r !xclip -selection clipboard -o<CR>]])

-------------------------------------------
-- Shell
-------------------------------------------

-- Double pressed tmux prefix key sends commands to this spawned
-- terminal instead of the parent one, in which vim is running.
--
-- Smart pane switching (C-h, C-j, C-k, C-l) keys do work inside
-- the inner tmux session, which is being run in this spawned terminal
-- from vim, in contrast with ssh-ing into VM and spawning terminal with tmux.
nnoremap("<leader>tt", [[:vert term zsh<CR>]])

-------------------------------------------
-- LSP / Diagnostics
-------------------------------------------

nnoremap("<leader>d", function()
  vim.diagnostic.open_float()
end)

nnoremap("<leader>g", function()
  vim.lsp.buf.code_action()
end)

-------------------------------------------
-- Custom commands
-------------------------------------------

nnoremap("<leader>u", ":UpdateHeader<CR>", {
  desc = "Update file header metadata",
})

-------------------------------------------
-- Project/Language specific
-------------------------------------------

-- [Python] Quick search for python class and def statments.
nnoremap("c/", [[/\<class ]])
nnoremap("m/", [[/\<def ]])

-- [C] C playground
--nmap("<F8>", [[:w \| !make rebuild && ./demo <CR>]])
--nmap("<F8>", [[:w \| :make rebuild <CR> \| :copen 30 <CR>]])

--nmap("<F8>", [[:w<CR>:silent !make rebuild <CR>:silent !./demo > .tmp.xyz<CR> \
--:tabnew<CR>:r .tmp.xyz<CR>:silent !rm .tmp.xyz<CR>:redraw!<CR>]])

--nmap("<F8>", [[:w<CR>:silent !chmod +x %:p<CR>:silent !%:p 2>&1 | tee \
--~/.config/vim/output<CR>:split ~/.config/vim/output<CR>:redraw!<CR>]])

-------------------------------------------
-- [Plugin] "stevearc/aerial.nvim"
-------------------------------------------

nnoremap("<leader>a", "<cmd>AerialToggle!<CR>")

-------------------------------------------
-- [Plugin] "stevearc/conform.nvim"
-------------------------------------------

nnoremap("<leader>f", function()
  require("conform").format({
    async = false,
    lsp_format = "never",
  })
end, { desc = "Format buffer" })

-------------------------------------------
-- [Plugin] "smjonas/inc-rename.nvim"
-------------------------------------------

-- map("n", "<leader>rn", ":IncRename ")

--------------------------------------------------
-- [Plugin] "lukas-reineke/indent-blankline.nvim"
--------------------------------------------------

nnoremap("<leader>ti", "<cmd>IBLToggle<CR>", {
  desc = "Toggle indent guides",
})

--------------------------------------------------
-- [Plugin] "kdheepak/lazygit.nvim"
--------------------------------------------------

--nmap("<leader>lg", "<cmd>LazyGit<cr>")

-------------------------------------------
-- [Plugin] "nvim-neo-tree/neo-tree.nvim"
-------------------------------------------

nnoremap("<C-n>", [[:Neotree<CR>]])
--noremap("<C-x>", [[:Neotree close<CR>]])

---------------------------------------------------------
-- [Plugin] "nvim-treesitter/nvim-treesitter-textobjects"
---------------------------------------------------------

local select = require("nvim-treesitter-textobjects.select")
local move = require("nvim-treesitter-textobjects.move")

local function textobject(lhs, capture, desc)
  local action = function()
    select.select_textobject(capture, "textobjects")
  end

  xnoremap(lhs, action, { desc = desc })
  onoremap(lhs, action, { desc = desc })
end

-- Text objects.
textobject("af", "@function.outer", "Around function")
textobject("if", "@function.inner", "Inside function")
textobject("aC", "@class.outer", "Around class")
textobject("iC", "@class.inner", "Inside class")
textobject("aa", "@parameter.outer", "Around argument")
textobject("ia", "@parameter.inner", "Inside argument")
textobject("al", "@loop.outer", "Around loop")
textobject("il", "@loop.inner", "Inside loop")
textobject("ac", "@call.outer", "Around function call")
textobject("ic", "@call.inner", "Inside function call")

local function textobject_move(lhs, method, desc)
  local action = function()
    move[method]("@function.outer", "textobjects")
  end

  nnoremap(lhs, action, { desc = desc })
  xnoremap(lhs, action, { desc = desc })
  onoremap(lhs, action, { desc = desc })
end

-- Function navigation.
textobject_move("]m", "goto_next_start", "Next function start")
textobject_move("[m", "goto_previous_start", "Previous function start")
textobject_move("]M", "goto_next_end", "Next function end")
textobject_move("[M", "goto_previous_end", "Previous function end")

-------------------------------------------
-- [Plugin] "nvim-telescope/telescope.nvim"
-------------------------------------------

nnoremap("<C-p>", function()
  require("telescope.builtin").find_files()
end)

nnoremap("<leader>o", "<cmd>Telescope buffers<CR>")
nnoremap("<leader>r", ":Telescope command_history<CR>")
nnoremap("<leader>s", ":Telescope search_history<CR>")
nnoremap("<leader>v", ":Telescope builtin<CR>")

--local builtin = require("telescope.builtin")
--nnoremap("<leader>fs", builtin.git_status, {
--  desc = "Git status (Telescope)",
--})

-------------------------------------------
-- [Plugin] "junegunn/vim-easy-align"
-------------------------------------------

-- Start interactive EasyAlign for a motion/text object (e.g. gaip)
nnoremap("ga", [[<Plug>(EasyAlign)]])
-- Start interactive EasyAlign in visual mode (e.g. vipga)
xnoremap("ga", [[<Plug>(EasyAlign)]])

-------------------------------------------
-- [Plugin] "tpope/vim-fugitive"
-------------------------------------------

nnoremap("<space>ga", [[:Git add %:p<CR><CR>]])
nnoremap("<space>gs", [[:Git<CR>]])
nnoremap("<space>gc", [[:Git commit -v -q<CR>]])
nnoremap("<space>gt", [[:Git commit -v -q %:p<CR>]])
--nnoremap("<space>gd",  [[:Gdiff<CR>]])
nnoremap("<space>gd", [[:Git diff<CR>]])
nnoremap("<space>ge", [[:Gedit<CR>]])
nnoremap("<space>gr", [[:Gread<CR>]])
nnoremap("<space>gw", [[:Gwrite<CR><CR>]])
nnoremap("<space>gl", [[:silent! Gclog<CR>:bot copen<CR>]])
nnoremap("<space>gp", [[:Ggrep<Space>]])
nnoremap("<space>gm", [[:GMove<Space>]])
nnoremap("<space>gb", [[:Git branch<Space>]])
nnoremap("<space>go", [[:Git checkout<Space>]])
nnoremap("<space>gps", [[:Git push<CR>]])
nnoremap("<space>gpl", [[:Git pull<CR>]])

-------------------------------------------
-- [Plugin] "lervag/vimtex"
-------------------------------------------

-- nmap("<leader>s", [[:VimtexStop<CR>]])
-- nmap("<leader>v", [[:VimtexCompile<CR>]])
