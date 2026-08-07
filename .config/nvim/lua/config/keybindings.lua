-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:00:32 CEST
-- Path:   ~/.config/nvim/lua/config/keybindings.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local Util = require("config.util")

local nmap = Util.nmap
local vmap = Util.vmap
local imap = Util.imap
local xmap = Util.xmap
local nunmap = Util.nunmap

local noremap  = Util.noremap
local inoremap = Util.inoremap
local nnoremap = Util.nnoremap
local vnoremap = Util.vnoremap
local xnoremap = Util.xnoremap

-------------------------------------------
-- General
-------------------------------------------

vim.g.mapleader = "\\"
-- Default value for `maplocalleader` is the same as `mapleader`
--vim.g.maplocalleader = "\\"

nmap("ss",        [[:wq<CR>]])
nmap("qq",        [[:q<CR>]])
nmap("<C-s>",     [[:w!<CR>]])
nmap("<F5>",      [[:cnext<CR>]])
nmap("<S-F5>",    [[:cprevious<CR>]])
nmap("<C-F5>",    [[:cc<CR>]])
--nmap("<leader>d", [[:pwd<CR>]])
nmap("<leader>h", [[:set hlsearch!<CR>]])

--nmap("<leader>n", [[:set relativenumber!<CR>]])

-- Enable both absolute and relative numbers
vim.keymap.set("n", "<leader>n", function()
  vim.opt.number       = true
  vim.opt.relativenumber = true
end, { noremap = true, silent = true })

-- Disable both absolute and relative numbers
vim.keymap.set("n", "<leader>N", function()
  vim.opt.relativenumber = false
  vim.opt.number       = false
end, { noremap = true, silent = true })

nmap("<leader>p", [[:setlocal paste!<CR>]])
nmap("<leader>s", [[:split<CR>]])
nmap("<leader>v", [[:vsplit<CR>]])
nmap("<leader>e", [[:edit<CR>]])
--nmap("<leader>u", [[:!urlview %<CR>]])
--inoremap("jk",    [[<esc>]]) -- "<C-[>" does the same

-- Move between buffers
nnoremap("<leader>]", [[:bnext<CR>]])
nnoremap("<leader>[", [[:bprevious<CR>]])

-- Treat long lines as break lines
nmap("j", [[gj]])
nmap("k", [[gk]])

-- Disable key for entering Ex-mode
nmap("Q", "")

--Disable F1 built-in help key
nmap("<F1>", "")
imap("<F1>", "")

-- Set textwidth to 79 characters
nmap("<leader>8", [[:set textwidth=79<CR>]])

-- Set textwidth to 88 characters
nmap("<leader>0", [[:set textwidth=88<CR>]])

-- Set textwidth to 100 characters
nmap("<leader>1", [[:set textwidth=100<CR>]])

-- Toggle showing all white spaces as characters
nmap("<leader>l", [[:set list!<CR>]])

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
nmap("<F49>", "gccj0", { remap = true })
vmap("<F49>", "gcj0", { remap = true })
imap("<F49>", "<Esc>gccj0", { remap = true })

-- Alt + F1
nmap("<M-F1>", "gccj0", { remap = true })
vmap("<M-F1>", "gcj0", { remap = true })
imap("<M-F1>", "<Esc>gccj0", { remap = true })

-- Vim registers <C-/> as <C-_>
nmap("<C-_>", "gccj0", { remap = true })
vmap("<C-_>", "gcj0", { remap = true })
imap("<C-_>", "<Esc>gccj0", { remap = true })

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

nmap("<C-Up>",    [[:resize -2<CR>]])
nmap("<C-Down>",  [[:resize +2<CR>]])
nmap("<C-Left>",  [[:vertical resize -2<CR>]])
nmap("<C-Right>", [[:vertical resize +2<CR>]])

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
vmap(    "<C-c>",  [["+y]])
vnoremap("Y",      [["+y]])
nnoremap("Y",      [["+yy]])
nnoremap("YY",     [["+yy]])
vnoremap("D",      [["+D]])

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
nmap("tp", [[:r !xclip -selection clipboard -o<CR>]])

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

-- [Python] Quick search for python class and def statments.
nmap("c/", [[/\<class ]])
nmap("m/", [[/\<def ]])

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

nmap("<leader>a", "<cmd>AerialToggle!<CR>")


-------------------------------------------
-- [Plugin] "smjonas/inc-rename.nvim"
-------------------------------------------

-- map("n", "<leader>rn", ":IncRename ")

--------------------------------------------------
--- [Plugin] "lukas-reineke/indent-blankline.nvim"
--------------------------------------------------

vim.keymap.set("n", "<leader>ti", function()
  require("plugins.ibl").toggle()
end, { desc = "Toggle indent guides" })


--------------------------------------------------
-- [Plugin] "kdheepak/lazygit.nvim"
--------------------------------------------------

--nmap("<leader>lg", "<cmd>LazyGit<cr>")

-------------------------------------------
-- [Plugin] "nvim-tree/nvim-tree.lua
-- ----------------------------------------

noremap("<C-n>", [[:Neotree<CR>]])
--noremap("<C-x>", [[:Neotree close<CR>]])

-------------------------------------------
-- [Plugin] "nvim-telescope/telescope.nvim"
-------------------------------------------

nmap("<C-p>", function() require("telescope.builtin").find_files() end)

noremap("<leader>o", "<cmd>Telescope buffers<CR>")
nmap("<leader>r", ":Telescope command_history<CR>")
nmap("<leader>s", ":Telescope search_history<CR>")
nmap("<leader>v", ":Telescope builtin<CR>")

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
nmap("<leader>w",        [[<Plug>(easymotion-overwin-w)]])

-------------------------------------------
-- [Plugin] "tpope/vim-fugitive"
-------------------------------------------

nnoremap("<space>ga",  [[:Git add %:p<CR><CR>]])
nnoremap("<space>gs",  [[:Git<CR>]])
nnoremap("<space>gc",  [[:Gcommit -v -q<CR>]])
noremap("<space>gt",   [[:Gcommit -v -q %:p<CR>]])
--nnoremap("<space>gd",  [[:Gdiff<CR>]])
nnoremap("<space>gd",  [[:Git diff<CR>]])
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

-- nmap("<leader>s", [[:VimtexStop<CR>]])
-- nmap("<leader>v", [[:VimtexCompile<CR>]])
--
--
--
--
--
--

nmap("<leader>d", function() vim.diagnostic.open_float() end)



--nmap("<leader>f", function() vim.lsp.buf.format() end)
nmap("<leader>f", function()
  require("conform").format({
    async = false,
    lsp_format = "never",
  })
end, { desc = "Format buffer" })

nmap("<leader>g", function() vim.lsp.buf.code_action() end)

-- Big J/K jumps multiple lines (compared to their smaller siblings j/k)
-- To be able to remap keys, they need to be unmapped first
--nunmap("J")
--nunmap("K")

nmap("<leader>c", [[:%s/\n\n\n\+/\r\r/g<CR>]])

--nmap("J", [[15j]])
nmap("K", [[15k]])

-- in your init.lua:

vim.api.nvim_create_user_command('UpdateHeader', function()
  local date = vim.fn.trim(vim.fn.system("date '+%F %T %Z'"))
  local fname = vim.api.nvim_buf_get_name(0)
  local raw  = vim.fn.system("readlink -f " .. vim.fn.shellescape(fname))
  local path = vim.fn.trim(vim.fn.system(
    "echo " .. vim.fn.shellescape(raw)
    .. " | sed -E 's|^" .. vim.env.HOME .. "|~|'"
  ))

  -- accept ; # / * - and spaces as the comment markers
  local prefix_cls = "[;%#/%%*%-%s]"

  for i = 1, 30 do
    local l = vim.api.nvim_buf_get_lines(0, i-1, i, false)[1]
    if not l then break end

    if l:match(prefix_cls .. "+Date:") then
      local new = l:gsub(
        "^(%s*"..prefix_cls.."*Date:%s*).*",
        "%1"..date
      )
      vim.api.nvim_buf_set_lines(0, i-1, i, false, { new })

    elseif l:match(prefix_cls .. "+Path:") then
      local new = l:gsub(
        "^(%s*"..prefix_cls.."*Path:%s*).*",
        "%1"..path
      )
      vim.api.nvim_buf_set_lines(0, i-1, i, false, { new })
    end
  end
end, {
  desc = "Refresh header Date and Path (lines 1–30), supports ; # /* - comments",
})

vim.keymap.set('n', '<leader>u', ':UpdateHeader<CR>', { desc = "Update file header metadata" })

--local builtin = require("telescope.builtin")
--vim.keymap.set("n", "<leader>fs", builtin.git_status, { desc = "Git status (Telescope)" })

-------------------------------------------
-- <TAB> character in insert mode
-------------------------------------------

-- Smart <Tab> and <S-Tab>
vim.defer_fn(function()
  local cmp_ok, cmp = pcall(require, "cmp")
  local ls_ok, ls = pcall(require, "luasnip")

  vim.keymap.set("i", "<Tab>", function()
    if cmp_ok and cmp.visible() then
      cmp.select_next_item()
      return ""
    elseif ls_ok and ls.expand_or_jumpable() then
      ls.expand_or_jump()
      return ""
    elseif vim.snippet and vim.snippet.active({ direction = 1 }) then
      vim.snippet.jump(1)
      return ""
    else
      -- accept Copilot only if visible; otherwise real Tab
      local ok, s = pcall(require, "copilot.suggestion")
      if ok and s.is_visible() then
        s.accept()
        return ""
      end
      return "<Tab>"
    end
  end, { expr = true, silent = true })

  vim.keymap.set("i", "<S-Tab>", function()
    if cmp_ok and cmp.visible() then
      cmp.select_prev_item()
      return ""
    elseif ls_ok and ls.jumpable(-1) then
      ls.jump(-1)
      return ""
    elseif vim.snippet and vim.snippet.active({ direction = -1 }) then
      vim.snippet.jump(-1)
      return ""
    end
    return "<S-Tab>"
  end, { expr = true, silent = true })
end, 20)
