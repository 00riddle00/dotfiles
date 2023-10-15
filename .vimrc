"---------------------------------------------------------------
" file:     ~/.vimrc
" author:   riddle00 - https://github.com/00riddle00
" vim:fenc=utf-8:nu:ai:si:et:ts=4:sw=4:ft=vim
"---------------------------------------------------------------

"===============================================================
"  SETTINGS
"===============================================================
"
" In Arch linux, vim loads the /usr/share/vim/vimfiles/archlinux.vim 
" settings file at the beginning

"=========================================
" [SETTINGS] Colors
"=========================================

color $VIMCOLOR
set background=dark

" Make sure we're getting 256 colors when it's available
if $TERM == "xterm-256color" || $TERM == "rxvt-unicode-256color" || $TERM == "screen-256color"
    set t_Co=256
endif

"=========================================
" [SETTINGS] Appearance
"=========================================

" Show count of selected lines or characters
set showcmd
" Show line numbers
set number
" Always show statusline
set laststatus=2
" Set relative line numbering
set relativenumber
"set norelativenumber
" show the line number on the bar
set ruler
" kudos to Jason Ryan (http://jasonwryan.com)
" (last element in statusline - escaped space character, 
"  do not remove it when removing trailing spaces from a file)
set statusline=\ \%f%m%r%h%w\ ::\ %y\ [%{&ff}]\ %{&fileencoding?&fileencoding:&encoding}\%=\ %c\ [%p%%:\ %l/%L]\ 

"=========================================
" [SETTINGS] Displaying text
"=========================================

" Set character encoding used inside Vim
set encoding=utf-8
" enable syntax highlighting
syntax enable
" Do not fold text/code
set nofoldenable
" Do not wrap lines
set nowrap
" Spelling
set spelllang=lt,en

"=========================================
" [SETTINGS] Editing text
"=========================================

" Text wrapping
set textwidth=199 " temporary setting
" Auto/smart indent
set autoindent smartindent

"=========================================
" [SETTINGS] Cursor movement
"=========================================

" Cursor movement behaviour
set nostartofline
" Jump 5 lines when running out of the screen
set scrolljump=5
" Indicate jump out of the screen when 3 lines before end of the screen
set scrolloff=3
" Show matching brackets when cursor is over them
set showmatch

"=========================================
" [SETTINGS] Mouse
"=========================================

" Set mouse to work in all modes
set mouse=a

"=========================================
" [SETTINGS] Buffers
"=========================================

" Allow to skip between buffers without
" writing or abandoning changes
set hidden

"=========================================
" [SETTINGS] Windows
"=========================================

" open the new window below the current one for horizontal splits,
" and to the right of the current one for vertical splits.
set splitbelow splitright

"=========================================
" [SETTINGS] Clipboard
"=========================================

" Use the clipboard register '*' (primary clipboard) for all yank, delete,
" change and put operations which would normally go to the unnamed register.
"
" For cross-application support,
" +xterm_clipboard must be enabled (see `vim --version | grep xterm_clipboard`)
" Easiest way for that is to just install gvim instead of vim.
"set clipboard+=unnamed

" Use the clipboard register '+' (secondary clipboard) for all yank, delete,
" change and put operations which would normally go to the unnamed register.
"
" For this to work at all,
" +xterm_clipboard must be enabled (see `vim --version | grep xterm_clipboard`)
" Easiest way for that is to just install gvim instead of vim.
"set clipboard+=unnamedplus

"=========================================
" [SETTINGS] Search
"=========================================

" search ignoring case
set ignorecase
" incremental search
set incsearch
" do not highlight the search
set nohlsearch
" Override the 'ignorecase' option if the search pattern contains upper case characters.
set smartcase

"=========================================
" [SETTINGS] Autocomplete
"=========================================

" Scan only opened buffers and current file, makes autocompletion faster.
set complete=.,w,b,u

"=========================================
" [SETTINGS] Tags
"=========================================

" set tags location
set tags=./tags,tags;$HOME

"=========================================
" [SETTINGS] Shell
"=========================================

set shell=/bin/zsh

"=========================================
" [SETTINGS] Backups
"=========================================

" Don't save backups
set nobackup
" Do not use swap file
set noswapfile

"=========================================
" [SETTINGS] Spaces
"=========================================

" How much spaces to autoindent
" shiftwidth governs indentation via >>, << 
set shiftwidth=4

" show spaces as '.'
" enable with ':set list'
set listchars+=space:.

"=========================================
" [SETTINGS] Tabs
"=========================================

"Use the appropriate number of spaces to insert a <Tab>
set expandtab
" Number of spaces that a <Tab> in the file counts for.
set tabstop=4

" Number of spaces that a <Tab> counts for while
" performing editing operations, like inserting
" a <Tab> or using <BS>.
set softtabstop=4

" show tabs as '|___'
" enable with ':set list'
set listchars+=tab:\|_,extends:>,precedes:<,nbsp:+

"===============================================================
"  MAPPINGS
"===============================================================

let mapleader = '\'

nmap     qq           :q<CR>
nmap     ss           :wq<CR>
nmap     <C-s>        :w!<CR>
nmap     <C-F5>       :cc<CR>
nmap     <S-F5>       :cprevious<CR>
nmap     <F5>         :cnext<CR>
nmap     <leader>d    :pwd<cr>
"nmap     <leader>e    :e<CR>|  " reload file
nmap     <leader>h    :set hlsearch!<CR>
nmap     <leader>n    :set relativenumber!<CR>
nmap     <leader>p    :setlocal paste!<CR>
nmap     <leader>r    :so $VIMRC<CR>
nnoremap <leader>u    :!urlview %<CR>
"nmap     <leader>s    :sp<cr>
"nmap     <leader>v    :vs<cr>
nmap     <leader>s    :VimtexStop<CR>
nmap     <leader>v    :VimtexCompile<CR>

" Move between buffers
nnoremap <leader>] :bn<CR>
nnoremap <leader>[ :bp<CR>

" Treat long lines as break lines
nmap     j            gj
nmap     k            gk

" Disable key for entering Ex-mode
nmap     Q            <nop>

" set textwidth to 79 characters
nmap     <leader>8    :set tw=79<CR>

" set textwidth to 100 characters
nmap     <leader>1    :set tw=100<CR>

" toggle showing all white spaces as characters
nmap     <leader>l    :set list!<CR>

" replace {more than one blank lines} with {exactly one blank line}
"nmap     <leader>l    :%s/\(\n\n\)\n\+/\1/g<CR> <C-o>

" remove trailing whitespace
"nmap     <leader>l    :%s/\(\n\n\)\n\+/\1/g<CR> <C-o>

"This removes all trailing lines that contain only whitespace.
"To remove only truly "empty" lines, remove the \s* from the above command.
"
"
"
"nmap <leader>l      :%s#\s\+$##e<CR><C-o> \| nmap <leader>l      :%s/\(\n\n\)\n\+/\1/e<CR><C-o> \| nmap <leader>l      :%s#\($\n\s*\)\+\%$##e<CR><C-o>

"nmap <leader>l      :%s#\s\+$##e<CR><C-o>
"nmap <leader>l      :%s/\(\n\n\)\n\+/\1/e<CR><C-o>
"nmap <leader>l      :%s#\($\n\s*\)\+\%$##e<CR><C-o>

    

"explanation:
"$\n - Match a new line (end-of-line character followed by a carriage return).
"\s* - Allow any amount of whitespace on this new line
"\+  - Allow any number of occurrences of this group (one or more).
"\%$ - Match the end of the file

nmap <silent> <leader>e  :e!<CR>
nmap <leader>j  :J<CR>
"command J    silent e!| Hex

"=========================================
" [MAPPINGS] Emacs-like insert mode
"=========================================

" motion
inoremap <C-f> <Right>
inoremap <C-b> <Left>

inoremap <M-f> <S-Right>
inoremap <M-b> <S-Left>

inoremap <C-a> <Home>
inoremap <C-e> <End>

inoremap <C-p> <Up>
inoremap <C-n> <Down>

" kill
inoremap <C-l> <Del> | "since <C-d> does not map
"<C-h> - already works.

inoremap <M-d> <Esc>ldwi
"<C-w> - already works.

inoremap <C-k> <Esc>lDa 
"<C-u> - already works.

inoremap <C-g> <Esc>cc 

" yank
inoremap <C-y> <C-r>"

" transpose chars
inoremap <silent> <C-t> <ESC>hxpa

"=========================================
" [MAPPINGS] Command-line mode
"=========================================

"See :help command-line-mode
"    :help command-line-window

"Not to be confused with Ex mode (see :help ex-mode)

"<Up>   - previous command in history
"<Down> - next command in history

"<C-r>{register} - insert the contents of a numbered or named register
"<C-r>" - insert the unnamed register, containing the text of the last delete or yank
"<C-r>* - insert the primary clipboard contents (X11: primary selection)
"<C-r>+ - insert the secondary clipboard contents
"<C-r>/ - insert the last search pattern
"<C-r>: - insert the last command-line
"<C-r>% - insert the current file name

"q: — open with a command history from normal mode
"q/ — open with a search history from normal mode (to search forward)
"q? — open with a search history from normal mode (to search backward)
"<C-f> — open with a command history from command mode

"<C-w> - delete the |word| before the cursor.
"<C-u> - remove all characters between the cursor position and the beginning of the line
"<C-c> - close command line window (if open) or return to normal mode

"=========================================
" [MAPPINGS] Windows
"=========================================

"--------------------------------
" [MAPPINGS] [Windows] navigation
"--------------------------------

"These mappings are set by vim-tmux-navigator plugin
"nmap     <C-j>          <C-W>j
"nmap     <C-k>          <C-W>k
"nmap     <C-h>          <C-W>h
"nmap     <C-l>          <C-W>l

"----------------------------
" [MAPPINGS] [Windows] resize
"----------------------------

nmap <silent> <C-Left>  :call ResizeLeft()<CR>
nmap <silent> <C-Right> :call ResizeRight()<CR>
nmap <silent> <C-Up>    :call ResizeUp()<CR>
nmap <silent> <C-Down>  :call ResizeDown()<CR>

"----------------------------
" [MAPPINGS] [Windows] layout
"----------------------------

" Change 2 split windows from vert to horiz or horiz to vert
nmap <leader>tv <C-w>t<C-w>H
nmap <leader>th <C-w>t<C-w>K

"=========================================
" [MAPPINGS] Tabs (layout)
"=========================================

nmap     tt             :tabnew<CR>
nmap     t0             :tabfirst<CR>
nmap     t$             :tablast<CR>
nmap     te             :tabedit %<CR>
nmap     th             gT
nmap     tl             gt

"=========================================
" [MAPPINGS] In-buffer navigation
"=========================================

" Scroll half screen to left and right vertically
noremap      zh           zH
noremap      zl           zL

" Scroll half screen to left and right vertically
noremap      zz           z-

"=========================================
" [MAPPINGS] Clipboard
"=========================================

" Yank into the system secondary clipboard register
"
" For this to work,
" +xterm_clipboard must be enabled (see `vim --version | grep xterm_clipboard`)
" Easiest way for that is to just install gvim instead of vim.
vmap <C-c> "+y

" Yank into the system secondary clipboard register and delete the visually selected text.
"
" For this to work,
" +xterm_clipboard must be enabled (see `vim --version | grep xterm_clipboard`)
" Easiest way for that is to just install gvim instead of vim.
"vmap <C-x> "+c

" Paste from the system secondary clipboard register and enter insert mode right after.
"
" For this to work,
" +xterm_clipboard must be enabled (see `vim --version | grep xterm_clipboard`)
" Easiest way for that is to just install gvim instead of vim.
"nmap <C-v> <ESC>"+pa

""" Paste from the system primary clipboard register (X11: primary selection)
""" (works for multiline indented text - as if 'paste' option has been set)
"nmap     to            :r !xsel<CR>

""" Paste from system secondary clipboard register
""" (works for multiline indented text - as if 'paste' option has been set)
nmap     tp             :r !xsel -b<CR>

"=========================================
" [MAPPINGS] Shell
"=========================================

" Double pressed tmux prefix key sends commands to this spawned
" terminal instead of the parent one, in which vim is running.
"
" Smart pane switching (C-h, C-j, C-k, C-l) keys do work inside
" the inner tmux session, which is being run in this spawned terminal
" from vim, in contrast with ssh-ing into VM and spawning terminal with tmux.
map <leader>tt :vert term zsh<CR>

"=========================================
" [MAPPINGS] Project/Language specific
"=========================================

" [Python specific] Quick search for python class and def statments.
nmap    c/          /\<class
nmap    m/          /\<def

" [C specific] Build DSA project
nmap <F8> :w \| !make rebuild && ./demo <CR>
"nmap <F8> :w \| :make rebuild <CR> \| :copen 30 <CR>
"nmap <F8> :w<CR>:silent !make rebuild <CR>:silent !./demo > .tmp.xyz<CR> :tabnew<CR>:r .tmp.xyz<CR>:silent !rm .tmp.xyz<CR>:redraw!<CR>
"nmap <F8> :w<CR>:silent !chmod +x %:p<CR>:silent !%:p 2>&1 | tee ~/.vim/output<CR>:split ~/.vim/output<CR>:redraw!<CR>

"===============================================================
" AUTOCOMMANDS
"===============================================================

" save all files on losing focus
" (unnamed buffers are not saved)
"autocmd FocusLost * silent! wa

" update current file when leaving insert mode
autocmd InsertLeave * silent! if expand('%') != '' | update | endif

" Use `sed -n l` to test keys ESC sequences.
" mapping ALT key
execute "set <M-f>=\ef"  
execute "set <M-b>=\eb"
execute "set <M-d>=\ed"

autocmd FileType help wincmd L|  " opens help window vertically
autocmd FileType markdown setlocal shiftwidth=2 tabstop=2 softtabstop=2
autocmd FileType markdown colorscheme miro8
autocmd BufNewFile,BufRead *.asm set ft=tasm syntax=tasm
autocmd BufNewFile,BufRead *.ASM set ft=tasm syntax=tasm
autocmd BufNewFile,BufRead *.bat set ft=dosbatch syntax=dosbatch
autocmd BufNewFile,BufRead *.BAT set ft=dosbatch syntax=dosbatch

autocmd BufNewFile,BufRead *.bnf set ft=bnf

autocmd BufNewFile,BufRead *.lst set ft=text

" set Python 80th char vertical line color
" (temporary workaround using 'autocmd')
autocmd FileType python highlight ColorColumn ctermbg=black

" temporary fix - to keep the cursor inside the editor buffer 
" after compilation, and not moving it to the quickfix buffer
"autocmd FileType tex let g:Tex_GotoError=0 

autocmd FileType tex set textwidth=100
autocmd FileType tex set colorcolumn=-1
autocmd FileType tex highlight ColorColumn ctermbg=black

autocmd FileType tex nnoremap <space><space> /(<>)<CR>
autocmd FileType tex inoremap ;c \ctext[RGB]{0,255,255}{}<Space>(<>)<Esc>T{i
autocmd FileType tex inoremap ;it \textit{}<Space>(<>)<Esc>T{i
autocmd FileType tex inoremap ;" „“<Space>(<>)<Esc>T„i

"===============================================================
"  COMMANDS
"===============================================================
" mistype fix
command! W          write

" file formats
command Bin         %!xxd -b -c 8
command Hex         %!xxd -c 16 -g 1 -u
command HexRevert   %!xxd -c 16 -r
command ReHex       :HexRevert
command HexDump     %!hexdump -C
command FFunix      :e ++ff=unix
command FFdos       :e ++ff=dos

" temp (for disasm)
command J    silent e!| Hex

"when searching: \n is newline, \r is <CR>
"when replacing: \r is newline, \n is a null byte.
command Dos2Unix    %s/\r/\r/g

" sort by markdown h1 headings
" '@' character should not appear in a file before running
" replace \n with '@' (except the newlines appearing before '# '),
"   sort the file, then restore newlines
command SortPa      %s/\n\(# \)\@!/@/g | sort | %s/@/\r/g

"===============================================================
"  MACROS
"===============================================================

" copy the current line without '\n' to secondary clipboard
"let @c = "0v$h\"+y:echo 'line copied!'

" tmp macro for marking progress
"let @p = "ver+W"

" insert heading separator above and below the line
"let @e = "a O11i=2xI# jo11i=2xI# Aak0"

" ???
"let @s = \":%s/\(.\+\)\n/\1@/ | sort | %s/@/\r/g <CR>"

" [Python specific] for debug
"let @o = "oprint(\"here\")\<Esc>k0"
let @o = "xi`p"

"===============================================================
"  FUNCTIONS
"===============================================================

"=========================================
" [FUNCTIONS] Startup
"=========================================

" a post-update hook after YCM install
function! BuildYCM(info)
  " info is a dictionary with 3 fields
  " - name:   name of the plugin
  " - status: 'installed', 'updated', or 'unchanged'
  " - force:  set on PlugInstall! or PlugUpdate!
  if a:info.status == 'installed' || a:info.force
    !./install.py
  endif
endfunction

"=========================================
" [FUNCTIONS] Resizing windows
"=========================================

"TODO wrap these 4 functions
"preferably in a single funciton

"TODO these functions to more than 
"2 windows

function! ResizeLeft()
  " if there are more than 2 windows
  if winnr('$') != 2 
    exe ":vertical resize -5"
    return
  endif
  " if it's a left window 
  " (when the split is vertical)
  if winnr() == 1
    exe ":vertical resize -5"
  else
    exe ":vertical resize +5"
  endif
endfunction

function! ResizeRight()
  " if there are more than 2 windows
  if winnr('$') != 2
    exe ":vertical resize +5"
    return
  endif
  " if it's a left window 
  " (when the split is vertical)
  if winnr() == 1 
    exe ":vertical resize +5"
  else
    exe ":vertical resize -5"
  endif
endfunction

function! ResizeUp()
  " if there are more than 2 windows
  if winnr('$') != 2
    exe ":resize -5"
    return
  endif
  " if it's a left window 
  " (when the split is vertical)
  if winnr() == 1 
    exe ":resize -5"
  else
    exe ":resize +5"
  endif
endfunction
 
function! ResizeDown()
  " if there are more than 2 windows
  if winnr('$') != 2
    exe ":resize +5"
    return
  endif
  " if it's a left window 
  " (when the split is vertical)
  if winnr() == 1 
    exe ":resize +5"
  else
    exe ":resize -5"
  endif
endfunction

"===============================================================
"  PLUGINS (STANDARD)
"===============================================================

"==============================================
" Standard-plugin 'matchparen'
"==============================================
 
"--------------------------------
" [PLUGIN][matchparen] Settings
"--------------------------------
 
" To disable the plugin after it was loaded:
":NoMatchParen
" And to enable it again:
":DoMatchParen
"
" Avoid loading the plugin
"let g:loaded_matchparen=1
 
"===============================================================
"  PLUGINS (EXTERNAL)
"===============================================================
"
" vim-plug is eliberately designed to be in a single file
" so that it can be easily downloaded and put into ~/.vim/autoload,
" so no manual modification of runtimepath is required.
"
" vim-plug also does the filetype off and on trick for you
"
" (vim-plug) Specify a directory for plugins
" Avoid using standard Vim directory names like 'plugin'
call plug#begin('~/.vim/plugged')

"---------------------------------------------------------------

"==============================================
 Plug 'vim-scripts/bnf.vim'
"==============================================

" <empty>

"==============================================
 Plug 'jlanzarotta/bufexplorer'
"==============================================

"--------------------------------
" [PLUGIN] [bufExplorer] Settings
"--------------------------------

" Do not show buffers from other tabs.
let g:bufExplorerFindActive=0
let g:bufExplorerShowTabBuffer=0
let g:bufExplorerShowRelativePath=1

"--------------------------------
" [PLUGIN] [bufExplorer] Mappings
"--------------------------------

noremap <leader>o :BufExplorer<CR>


"==============================================
 Plug 'github/copilot.vim'
"==============================================
"
"--------------------------
" [PLUGIN] [Copilot] Settings
"--------------------------

"let g:copilot_enabled = v:false

"==============================================
 Plug 'ctrlpvim/ctrlp.vim'
"==============================================

"--------------------------
" [PLUGIN] [CtrlP] Settings
"--------------------------

" ignoring in ctrlp
if executable('ag')
  " Use The Silver Searcher https://github.com/ggreer/the_silver_searcher
  set grepprg=ag\ --nogroup\ --nocolor
  " Use ag in CtrlP for listing files. Lightning fast, respects .gitignore
  " and .ignore. Ignores hidden files by default.
  let g:ctrlp_user_command = 'ag %s -l --nocolor -f -g ""'
else
  "ctrl+p ignore files in .gitignore
  let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files . -co --exclude-standard', 'find %s -type f']
endif

"--------------------------
" [PLUGIN] [CtrlP] Mappings
"--------------------------

" search for a file among open buffers
nmap <leader>bb :CtrlPBuffer<cr>

"--------------------------
" [PLUGIN] [CtrlP] Commands
"--------------------------

" CtrlP refresh
command CC CtrlPClearAllCaches

"==============================================
 Plug 'raimondi/delimitmate'
"==============================================

"--------------------------------
" [PLUGIN] [delimitMate] Settings
"--------------------------------

let delimitMate_expand_cr=1


"==============================================
 Plug 'othree/eregex.vim'
"==============================================

" <empty>

"==============================================
 Plug 'scrooloose/nerdcommenter'
"==============================================

"----------------------------------
" [PLUGIN] [NERDCommenter] Mappings
"----------------------------------

" Escape sequences depend on the terminal emulator.
" Use `sed -n l` to test keys' ESC sequences.
" ex. ^[^[OP (for Alt-<F1> in rxvt-unicode) means <Esc><Esc>OP
"
" rxvt-unicode
map  <Esc><Esc>OP <Plug>NERDCommenterToggle<CR>
imap <Esc><Esc>OP <ESC><Plug>NERDCommenterToggle<CR>
"
" Alacritty
map  <Esc>[1;3P <Plug>NERDCommenterToggle<CR>
imap  <Esc>[1;3P <ESC><Plug>NERDCommenterToggle<CR>


" vim registers <C-/> as <C-_>
map  <C-_>         <Plug>NERDCommenterToggle<CR>
imap <C-_>         <ESC><Plug>NERDCommenterToggle<CR>

" ignore default NERDCommenter keybindings
map  <leader>cc   <nop>
map  <leader>cu   <nop>

"==============================================
 Plug 'scrooloose/nerdtree'
"==============================================

"-----------------------------
" [PLUGIN] [NERDTree] Settings
"-----------------------------

let g:NERDTreeQuitOnOpen = 0
let g:NERDTreeWinPos = "left"
let g:NERDTreeWinSize = 30
let g:NERDTreeMapHelp = 'Y'
let NERDTreeIgnore = [
    \ '\~$','\.pyc$', '\.so$', '\.a$', '\.swp', '*\.swp', '\.swo',
    \ '\.swn', '\.swh', '\.swm', '\.swl', '\.swk', '\.sw*$', 
    \ '[a-zA-Z]*egg[a-zA-Z]*', '[a-zA-Z]*cache[a-zA-Z]*'
\ ]

"-----------------------------
" [PLUGIN] [NERDTree] Mappings
"-----------------------------

noremap    <C-n>                :NERDTreeToggle<CR>
noremap    <silent><C-x>        :call FocusNERDTree()<CR>

"---------------------------------
" [PLUGIN] [NERDTree] Autocommands
"---------------------------------

" Close vim if the only window left open is a NERDTree
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
" open a NERDTree automatically when vim starts up
autocmd vimenter * NERDTree
" Focus the window and not the NERDTree (which is also opened) when vim starts up
autocmd VimEnter * wincmd p
" open a NERDTree automatically when vim starts up if no files were specified
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

"------------------------------
" [PLUGIN] [NERDTree] Functions
"------------------------------

" focus/unfocus NERDTree
" place the cursor back in the same window
" if no new file is opened via NERDTree
function! FocusNERDTree()
  if @% =~ "NERD_tree_*"
      exe "normal \<C-w>p"
  else
      NERDTreeFocus
  endif
endfunction

"==============================================
 Plug 'joshdick/onedark.vim'
"==============================================

" <empty>

"==============================================
 Plug 'python-mode/python-mode'
"==============================================

"--------------------------------
" [PLUGIN] [python-mode] Settings
"--------------------------------

" run python file with <leader>r (amazing functionality!)
let g:pymode_lint_checkers = ['pyflakes']
let g:pymode_lint_cwindow = 0
let g:pymode_lint_on_write = 0
let g:pymode_rope_complete_on_dot = 0
let g:pyflakes_use_quickfix = 0
let g:pymode_lint_cwindow = 0

"==============================================
 Plug 'vim-python/python-syntax'
"==============================================

"----------------------------------
" [PLUGIN] [python-syntax] Settings
"----------------------------------

let g:python_highlight_all = 1

"==============================================
 Plug 'scrooloose/syntastic'
"==============================================

"------------------------------
" [PLUGIN] [Syntastic] Settings
"------------------------------

let g:syntastic_mode_map = { 'mode': 'passive' }

let g:syntastic_enable_signs = 1
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
set statusline+=%#warningmsg#
set statusline+=%*
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_javascript_mri_args = "--config=$HOME/.jshintrc"
let g:syntastic_python_python_exec = '/usr/bin/python3'
let g:syntastic_python_checkers = [ 'pylint', 'flake8', 'pep8', 'pyflakes', 'python']
let g:syntastic_filetype_map = {'python.django': 'python'}
let g:syntastic_python_pep8_args = '--ignore=E501'
let g:syntastic_yaml_checkers = ['jsyaml']
let g:syntastic_html_tidy_exec = 'tidy5'
let g:syntastic_tex_checkers = ['chktex']
"let g:syntastic_tex_checkers = ['lacheck']

"------------------------------
" [PLUGIN] [Syntastic] Mappings
"------------------------------

" Turn off Syntastic for the major part of working with LaTeX
nmap     <leader>c      :SyntasticToggleMode<CR>

"==============================================
 Plug 'majutsushi/tagbar'
"==============================================

"---------------------------
" [PLUGIN] [TagBar] Settings
"---------------------------

let g:tagbar_width = 30
let g:tagbar_sort = 0

"---------------------------
" [PLUGIN] [TagBar] Mappings
"---------------------------

nmap <leader>b :TagbarToggle<cr>

"==============================================
 Plug 'Chiel92/vim-autoformat'
"==============================================

"-------------------------------
" [PLUGIN] [Autoformat] Settings
"-------------------------------

let g:autoformat_autoindent = 0
let g:autoformat_retab = 0
let g:autoformat_remove_trailing_spaces = 0
let g:formatter_yapf_style = 'pep8'

"-------------------------------
" [PLUGIN] [Autoformat] Commands
"-------------------------------

noremap <F6> :Autoformat<CR>

"==============================================
 Plug 'octol/vim-cpp-enhanced-highlight'
"==============================================

"-------------------------------------------
" [PLUGIN] [cpp-enhanced-highlight] Settings
"-------------------------------------------

"Vim tend to a have issues with flagging braces as errors,
"see for example https://github.com/vim-jp/vim-cpp/issues/16.
"A workaround is to set:
let c_no_curly_error=1

"==============================================
 Plug 'ryanoasis/vim-devicons'
"==============================================

" <empty>

"==============================================
 Plug 'junegunn/vim-easy-align'
"==============================================

"------------------------------
" [PLUGIN] [EasyAlign] Mappings
"------------------------------

" Start interactive EasyAlign in visual mode (e.g. vipga)
"xmap ga <Plug>(EasyAlign)
" Start interactive EasyAlign for a motion/text object (e.g. gaip)
"nmap ga <Plug>(EasyAlign)

"==============================================
 Plug 'easymotion/vim-easymotion'
"==============================================

"-------------------------------
" [PLUGIN] [EasyMotion] Settings
"-------------------------------

let g:EasyMotion_smartcase = 1

"-------------------------------
" [PLUGIN] [EasyMotion] Mappings
"-------------------------------

nmap <leader><leader> <Plug>(easymotion-overwin-f)
nmap <Leader>w <Plug>(easymotion-overwin-w)

"==============================================
 Plug 'houtsnip/vim-emacscommandline'
"==============================================

" (see :h emacscommandline for more info)
let g:EmacsCommandLineSearchCommandLineDisable = 1

"==============================================
 Plug 'tpope/vim-fugitive'
"==============================================

"-----------------------------
" [PLUGIN] [fugitive] Mappings
"-----------------------------

nnoremap <space>ga :Git add %:p<CR><CR>
nnoremap <space>gs :Git<CR>
nnoremap <space>gc :Gcommit -v -q<CR>
noremap  <space>gt :Gcommit -v -q %:p<CR>
nnoremap <space>gd :Gdiff<CR>
nnoremap <space>ge :Gedit<CR>
nnoremap <space>gr :Gread<CR>
nnoremap <space>gw :Gwrite<CR><CR>
nnoremap <space>gl :silent! Glog<CR>:bot copen<CR>
nnoremap <space>gp :Ggrep<Space>
nnoremap <space>gm :Gmove<Space>
nnoremap <space>gb :Git branch<Space>
nnoremap <space>go :Git checkout<Space>
nnoremap <space>gps :Dispatch! git push<CR>
nnoremap <space>gpl :Dispatch! git pull<CR>

"==============================================
 Plug 'thinca/vim-quickrun'
"==============================================

" <empty>

"==============================================
" Plug 'tpope/vim-surround'
"==============================================

" <empty>

"==============================================
 Plug 'christoomey/vim-tmux-navigator'
"==============================================

" <empty>

"==============================================
 Plug 'lervag/vimtex'
"==============================================

"VimtexView - open pdf reader
"VimtexCompile - compile (and then autocompiles on :w)
"VimtexTocOpen - open ToC navigation on the left
"To change LaTeX engine, refer to plugin's documentation.

"-------------------------------------------
" [PLUGIN] [vimtex] Settings
"-------------------------------------------

let g:vimtex_view_method = 'zathura'

let g:vimtex_compiler_latexmk_engines = {
    \ '_'                : '-xelatex',
    \}


let g:vimtex_quickfix_ignore_filters = [
      \ 'Underfull',
      \ 'Overfull',
      \]

"=============================================================
 Plug 'ycm-core/YouCompleteMe', { 'do': function('BuildYCM') }
"=============================================================

"----------------------------------
" [PLUGIN] [YouCompleteMe] Settings
"----------------------------------

let g:ycm_python_binary_path = '/usr/bin/python3'
"let g:ycm_key_list_stop_completion = ['<C-y>', '<CR>', '<TAB>'] "before using GitHub Copilot
let g:ycm_key_list_stop_completion = ['<C-y>', '<CR>']
"let g:ycm_key_list_select_completion = ['<Down>', '<TAB>'] "before using GitHub Copilot
let g:ycm_key_list_select_completion = ['<Down>']

"----------------------------------
" [PLUGIN] [YouCompleteMe] Mappings
"----------------------------------

inoremap <expr> <C-j> pumvisible() ? "\<C-n>" : "\<C-j>"
inoremap <expr> <C-k> pumvisible() ? "\<C-p>" : "\<C-k>"
inoremap <expr> <C-d> pumvisible() ? "\<PageDown>\<C-p>\<C-n>" : "\<C-d>"
inoremap <expr> <C-u> pumvisible() ? "\<PageUp>\<C-p>\<C-n>" : "\<C-u>"

"---------------------------------------------------------------

" (vim-plug) Initialize plugin system
" Automatically executes 'filetype plugin indent on' and 'syntax enable'. You can
" revert the settings after the call. e.g. 'filetype indent off', 'syntax off', etc.
call plug#end()

"===============================================================
"  TEMP
"===============================================================
" appears mostly when appending output to .vimrc

" shows how many times a search pattern occurs in the current buffer
" somewhy this settings works only when it's placed at the end of the file
set shortmess-=S

nmap <F1> :echo<CR>
imap <F1> <C-o>:echo<CR>
