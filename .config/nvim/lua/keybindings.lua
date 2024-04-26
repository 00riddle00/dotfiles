-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-04-22 02:18:03 EEST
-- Path:   ~/.config/nvim/lua/keybindings.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local Util = require("util")

local nmap = Util.nmap
local vmap = Util.vmap
local imap = Util.imap
local xmap = Util.xmap
local map = vim.keymap.set

local noremap = Util.noremap
local inoremap = Util.inoremap
local nnoremap = Util.nnoremap
local vnoremap = Util.vnoremap
local xnoremap = Util.xnoremap

-------------------------------------------
-- General
-------------------------------------------

vim.g.mapleader = "\\"

nmap(      "ss",            [[:wq<CR>]])
nmap(      "qq",            [[:q<CR>]])
nmap(      "<C-s>",         [[:w!<CR>]])
nmap(      "<F5>",          [[:cnext<CR>]])
nmap(      "<S-F5>",        [[:cprevious<CR>]])
nmap(      "<C-F5>",        [[:cc<CR>]])
nmap(      "<leader>d",     [[:pwd<CR>]])
nmap(      "<leader>h",     [[:set hlsearch!<CR>]])
nmap(      "<leader>n",     [[:set relativenumber!<CR>]])
nmap(      "<leader>p",     [[:setlocal paste!<CR>]])
nmap(      "<leader>s",     [[:sp<CR>]])
nmap(      "<leader>v",     [[:vs<CR>]])
--nmap(    "<leader>s",     [[:VimtexStop<CR>]])
--nmap(    "<leader>v",     [[:VimtexCompile<CR>]])
--nmap(    "<leader>e",     [[:e<CR>]])  -- reload file
--inoremap("jk",            [[<esc>]]) -- "<C-[>" does the same
nnoremap(  "<leader>u",     [[:!urlview %<CR>]])

-- Move between buffers
nnoremap("<leader>]", [[:bn<CR>]])
nnoremap("<leader>[", [[:bp<CR>]])

-- Treat long lines as break lines
nmap("j", [[gj]])
nmap("k", [[gk]])

-- Disable key for entering Ex-mode
nmap("Q", "")

--Disable F1 built-in help key
nmap("<F1>", "")
imap("<F1>", "")

-- set textwidth to 79 characters
nmap("<leader>8", [[:set textwidth=79<CR>]])

-- set textwidth to 88 characters
nmap("<leader>0", [[:set textwidth=88<CR>]])

-- set textwidth to 100 characters
nmap("<leader>1", [[:set textwidth=100<CR>]])

-- toggle showing all white spaces as characters
nmap("<leader>l", [[:set list!<CR>]])

-- replace {more than one blank lines} with {exactly one blank line}
--nmap("<leader>l", [[:%s/\(\n\n\)\n\+/\1/g<CR> <C-o>]])
--
-- :%s#\s\+$##e<CR><C-o>
-- :%s/\(\n\n\)\n\+/\1/e<CR><C-o>
-- :%s#\($\n\s*\)\+\%$##e<CR><C-o>
--
-- explanation:
-- $\n - Match a new line (end-of-line character followed by a carriage return).
-- \s* - Allow any amount of whitespace on this new line
-- \+  - Allow any number of occurrences of this group (one or more).
-- \%$ - Match the end of the file

-------------------------------------------
-- Emacs-like insert mode
-------------------------------------------

-- motion
inoremap("<C-f>", [[<Right>]])
inoremap("<C-b>", [[<Left>]])

inoremap("<M-f>", [[<S-Right>]])
inoremap("<M-b>", [[<S-Left>]])

inoremap("<C-a>", [[<Home>]])
inoremap("<C-e>", [[<End>]])

inoremap("<C-p>", [[<Up>]])
inoremap("<C-n>", [[<Down>]])

-- kill
inoremap("<C-d>", [[<Del>]])
-- <C-h> - already works.

inoremap("<M-d>", [[<Esc>ldwi]])
-- <C-w> - already works.

inoremap("<C-k>", [[<Esc>lDa]])
-- <C-u> - already works.

inoremap("<C-g>", [[<Esc>cc]])

-- yank
inoremap("<C-y>", [[<C-r>"]])

-- undo (vim registers <C-/> as <C-_>)
inoremap("<C-_>", [[<C-O>u]])

-- transpose chars
--inoremap("<C-t>", [[<ESC>hxpa]])

-- transpose words (very fragile)
inoremap("<C-t>", [[<ESC>BB"xdiWdWep"xpa]])

-------------------------------------------
-- Command-line mode
-------------------------------------------

-- See :help Command-line-mode
--     :help command-line-window

-- Not to be confused with Ex mode (see :help ex-mode)

-- <Up>   - previous command in history
-- <Down> - next command in history

-- <C-r>{register} - insert the contents of a numbered or named register
-- <C-r>" - insert the unnamed register, containing the text of the last delete or yank
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
-- <C-u> - remove all characters between the cursor position and the beginning of the line
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

-- TODO simplify these functions and preferably put in a single function

_G.ResizeLeft = function()
  -- if there are more than 2 windows
  if vim.fn.winnr("$") ~= 2 then
    vim.cmd(":vertical resize -5")
    return
  end
  -- if it's a left window
  -- (when the split is vertical)
  if vim.fn.winnr() == 1 then
    vim.cmd(":vertical resize -5")
  else
    vim.cmd(":vertical resize +5")
  end
end

_G.ResizeRight = function()
  -- if there are more than 2 windows
  if vim.fn.winnr("$") ~= 2 then
    vim.cmd(":vertical resize +5")
    return
  end
  -- if it's a left window
  -- (when the split is vertical)
  if vim.fn.winnr() == 1 then
    vim.cmd(":vertical resize +5")
  else
    vim.cmd(":vertical resize -5")
  end
end

_G.ResizeUp = function()
  -- if there are more than 2 windows
  if vim.fn.winnr("$") ~= 2 then
    vim.cmd(":resize -5")
    return
  end
  -- if it's a left window
  -- (when the split is vertical)
  if vim.fn.winnr() == 1 then
    vim.cmd(":resize -5")
  else
    vim.cmd(":resize +5")
  end
end

_G.ResizeDown = function()
  -- if there are more than 2 windows
  if vim.fn.winnr("$") ~= 2 then
    vim.cmd(":resize +5")
    return
  end
  -- if it's a left window
  -- (when the split is vertical)
  if vim.fn.winnr() == 1 then
    vim.cmd(":resize +5")
  else
    vim.cmd(":resize -5")
  end
end

-- Key mappings
nmap("<C-Left>",  [[<cmd>lua ResizeLeft()<CR>]])
nmap("<C-Right>", [[<cmd>lua ResizeRight()<CR>]])
nmap("<C-Up>",    [[<cmd>lua ResizeUp()<CR>]])
nmap("<C-Down>",  [[<cmd>lua ResizeDown()<CR>]])

-------------------------------------------
-- [Windows] layout
-------------------------------------------

-- Change 2 split windows from vert to horiz or horiz to vert
nmap("<leader>tv", [[<C-w>t<C-w>H]])
nmap("<leader>th", [[<C-w>t<C-w>K]])

-------------------------------------------
-- Tabs (layout)
-------------------------------------------

nmap("tt", [[:tabnew<CR>]])
nmap("t0", [[:tabfirst<CR>]])
nmap("t$", [[:tablast<CR>]])
nmap("te", [[:tabedit %<CR>]])
nmap("th", [[gT]])
nmap("tl", [[gt]])

-------------------------------------------
-- In-buffer navigation
-------------------------------------------

-- Scroll half screen to left and right vertically
noremap("zh", [[zH]])
noremap("zl", [[zL]])

-- Scroll half screen to left and right vertically
noremap("zz", [[z-]])

-------------------------------------------
-- Clipboard
-------------------------------------------

-- Yank into the system secondary clipboard register
vmap("<C-c>", [["+y]])
--nnoremap("Y", [["+y]])
--vnoremap("Y", [["+y]])
--nnoremap("YY", [["+yy]])

-- Yank into the system secondary clipboard register and delete the visually selected text.
--vmap("<C-x>", [["+c]])

-- Paste from the system secondary clipboard register and enter insert mode right after.
--nmap("<C-v>", [[<ESC>"+pa]])

-- Paste from the system primary clipboard register (X11: primary selection)
-- (works for multiline indented text - as if "paste" option has been set)
--nmap("to", [[:r !xsel<CR>]])

-- Paste from system secondary clipboard register
-- (works for multiline indented text - as if "paste" option has been set)
nmap("tp", [[:r !xsel -b<CR>]])

-------------------------------------------
-- Shell
-------------------------------------------

-- Double pressed tmux prefix key sends commands to this spawned
-- terminal instead of the parent one, in which vim is running.
--
-- Smart pane switching (C-h, C-j, C-k, C-l) keys do work inside
-- the inner tmux session, which is being run in this spawned terminal
-- from vim, in contrast with ssh-ing into VM and spawning terminal with tmux.
nmap("<leader>tt", [[:vert term zsh<CR>]])

-------------------------------------------
-- Project/Language specific
-------------------------------------------

-- [Python specific] Quick search for python class and def statments.
nmap("c/", [[/\<class ]])
nmap("m/", [[/\<def ]])

-- [C specific] C playground
--nmap("<F8>", [[:w \| !make rebuild && ./demo <CR>]])
--nmap("<F8>", [[:w \| :make rebuild <CR> \| :copen 30 <CR>]])
--nmap("<F8>", [[:w<CR>:silent !make rebuild <CR>:silent !./demo > .tmp.xyz<CR> :tabnew<CR>:r .tmp.xyz<CR>:silent !rm .tmp.xyz<CR>:redraw!<CR>]])
--nmap("<F8>", [[:w<CR>:silent !chmod +x %:p<CR>:silent !%:p 2>&1 | tee ~/.vim/output<CR>:split ~/.vim/output<CR>:redraw!<CR>]])


-------------------------------------------
-- [Plugin] "jlanzarotta/bufexplorer"
-------------------------------------------

noremap("<leader>o", [[:BufExplorer<CR>]])

-------------------------------------------
-- [Plugin] "ctrlpvim/ctrlp.vim"
-------------------------------------------

-- Search for a file among open buffers.
nmap("<leader>bb", [[:CtrlPBuffer<CR>]])

-------------------------------------------
-- [Plugin] "preservim/nerdcommenter"
-------------------------------------------

-- Escape sequences depend on the terminal emulator.
-- Use `sed -n l` to test keys' ESC sequences.
-- ex. ^[^[OP (for Alt-<F1> in rxvt-unicode) means <Esc><Esc>OP

-- rxvt-unicode
nmap("<M-F1>", [[<Plug>NERDCommenterToggle]])
vmap("<M-F1>", [[<Plug>NERDCommenterToggle]])
imap("<M-F1>", [[<ESC><Plug>NERDCommenterToggle]])

-- Alacritty
nmap("<Esc>[1;3P", [[<Plug>NERDCommenterToggle]])
vmap("<Esc>[1;3P", [[<Plug>NERDCommenterToggle]])
imap("<Esc>[1;3P", [[<ESC><Plug>NERDCommenterToggle]])

-- vim registers <C-/> as <C-_>
nmap("<C-_>", [[<Plug>NERDCommenterToggle]])
vmap("<C-_>", [[<Plug>NERDCommenterToggle]])
imap("<C-_>", [[<ESC><Plug>NERDCommenterToggle]])

-------------------------------------------
-- [Plugin] "preservim/nerdtree"
-------------------------------------------

_G.FocusNERDTree = function()
  -- Check if the current buffer's name matches "NERD_tree_*"
  if vim.fn.bufname() ~= "" and string.match(vim.fn.bufname(), "NERD_tree_") then
    -- Execute the normal mode command to switch to the previously active window
    vim.api.nvim_command("normal! <C-w>p")
  else
    -- Focus or open NERDTree if the current buffer is not a NERDTree buffer
    vim.api.nvim_command("NERDTreeFocus")
  end
end

noremap("<C-n>", [[:NERDTreeToggle<CR>]])
noremap("<C-x>", [[<cmd>lua FocusNERDTree()<CR>]])

-------------------------------------------
-- [Plugin] "nvim-telescope/telescope.nvim"
-------------------------------------------

nmap("<C-p>", [[<cmd>lua require("telescope.builtin").find_files()<cr>]])

-------------------------------------------
-- [Plugin] "preservim/tagbar"
-------------------------------------------

nmap("<leader>b", [[:TagbarToggle<CR>]])

-------------------------------------------
-- [Plugin] "vim-autoformat/vim-autoformat"
-------------------------------------------

noremap("<F6>", [[:Autoformat<CR>]])

-------------------------------------------
-- [Plugin] "junegunn/vim-easy-align"
-------------------------------------------

-- Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap("ga", [[<Plug>(EasyAlign)]])
-- Start interactive EasyAlign in visual mode (e.g. vipga)
xmap("ga", [[<Plug>(EasyAlign)]])

-------------------------------------------
-- [Plugin] "easymotion/vim-easymotion"
-------------------------------------------

nmap("<leader><leader>", [[<Plug>(easymotion-overwin-f)]])
nmap("<Leader>w", [[<Plug>(easymotion-overwin-w)]])

-------------------------------------------
-- [Plugin] "tpope/vim-fugitive"
-------------------------------------------

nnoremap("<space>ga",  [[:Git add %:p<CR><CR>]])
nnoremap("<space>gs",  [[:Git<CR>]])
nnoremap("<space>gc",  [[:Gcommit -v -q<CR>]])
noremap("<space>gt",   [[:Gcommit -v -q %:p<CR>]])
nnoremap("<space>gd",  [[:Gdiff<CR>]])
nnoremap("<space>ge",  [[:Gedit<CR>]])
nnoremap("<space>gr",  [[:Gread<CR>]])
nnoremap("<space>gw",  [[:Gwrite<CR><CR>]])
nnoremap("<space>gl",  [[:silent! Glog<CR>:bot copen<CR>]])
nnoremap("<space>gp",  [[:Ggrep<Space>]])
nnoremap("<space>gm",  [[:Gmove<Space>]])
nnoremap("<space>gb",  [[:Git branch<Space>]])
nnoremap("<space>go",  [[:Git checkout<Space>]])
nnoremap("<space>gps", [[:Dispatch! git push<CR>]])
nnoremap("<space>gpl", [[:Dispatch! git pull<CR>]])

-------------------------------------------
-- [Plugin] "lervag/vimtex"
-------------------------------------------

nmap("<leader>s", [[:VimtexStop<CR>]])
nmap("<leader>v", [[:VimtexCompile<CR>]])
