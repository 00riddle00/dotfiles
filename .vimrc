"---------------------------------------------------------------
" file:     ~/.vimrc
" author:   riddle00 - https://github.com/00riddle00
" vim:fenc=utf-8:nu:ai:si:et:ts=4:sw=4:ft=vim
"---------------------------------------------------------------

"===============================================================
"  SETTINGS
"===============================================================

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
" Set relative numbering
set relativenumber
" show the line number on the bar
set ruler
" kudos to Jason Ryan (http://jasonwryan.com)
set statusline=\ \%f%m%r%h%w\ ::\ %y\ [%{&ff}]\ %{&fileencoding?&fileencoding:&encoding}\%=\ %c\ [%p%%:\ %l/%L]\ 

"=========================================
" [SETTINGS] Displaying text
"=========================================

" Set character encoding used inside Vim
set encoding=utf-8
" enable syntax hightlighting
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
set textwidth=79
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

" Yank and copy to X clipboard
" +xterm_clipboard must be enabled (see vim --version)
set clipboard+=unnamed                  

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
nmap     <leader>e    :e<CR>    " reload file
nmap     <leader>h    :set hlsearch!<CR>
nmap     <leader>n    :set relativenumber!<CR>
nmap     <leader>p    :setlocal paste!<CR>
nmap     <leader>r    :so $VIMRC<CR>
nmap     <leader>s    :sp<cr>
nnoremap <leader>u    :!urlview %<CR>
nmap     <leader>v    :vs<cr>

" Treat long lines as break lines
nmap     j            gj
nmap     k            gk

" Disable key for ex mode
nmap     Q            <nop>

" replace {more than one blank lines} with {exactly one blank line}
nmap     <leader>l    :%s/\(\n\n\)\n\+/\1/g<CR> <C-o>   

" cmdline mappings
cnoremap <C-a> <Home>
cnoremap <C-e> <End>
cnoremap <C-p> <Up>
cnoremap <C-n> <Down>
cnoremap <C-b> <Left>
" exception, since <C-f> in cmdline 
" is already taken by default
cnoremap <C-l> <Right>
" <C-h>, <C-w>, <C-u> also work 
" just like in vim's insert mode

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

"<C-Left>
nmap <silent> [1;5D :vertical resize -5<CR> 
"<C-Right>
nmap <silent> [1;5C :vertical resize +5<CR>
"<C-Up>
nmap <silent> [1;5A :resize +5<CR>
"<C-Down>
nmap <silent> [1;5B :resize -5<CR>

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

" Copy/Paste
vmap <C-c> "+y
vmap <C-x> "+c
"nmap <C-v> <ESC>"+pa

" Long text paste
"""" From primary clipboard
"nmap     tp            :r !xsel<CR>
"""" From secondary clipboard
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

autocmd FileType help wincmd L  " opens help window vertically
autocmd FileType markdown setlocal shiftwidth=2 tabstop=2 softtabstop=2
autocmd BufNewFile,BufRead *.asm set ft=tasm syntax=tasm
autocmd BufNewFile,BufRead *.ASM set ft=tasm syntax=tasm
autocmd BufNewFile,BufRead *.bat set ft=dosbatch syntax=dosbatch
autocmd BufNewFile,BufRead *.BAT set ft=dosbatch syntax=dosbatch

"===============================================================
"  COMMANDS
"===============================================================

" mistype fix
command! W          write

" file formats
command Bin         %!xxd -b -c 8
command BinRevert   %!xxd -r
command Hex         %!xxd -c 16 -g 1
command HexRevert   %!xxd -c 16 -r
command HexDump     %!hexdump -C
command FFunix      :e ++ff=unix
command FFdos       :e ++ff=dos

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

" insert heading separator above and below the line
let @e = "a O11i=2xI# jo11i=2xI# Aak0"

" ???
"let @s = \":%s/\(.\+\)\n/\1@/ | sort | %s/@/\r/g <CR>"

" [Python specific] for debug
let @o = "oprint(\"here\")\<Esc>k0"

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

"===============================================================
"  PLUGINS
"===============================================================

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
 Plug 'scrooloose/nerdtree'
"==============================================

"-----------------------------
" [PLUGIN] [NERDTree] Settings
"-----------------------------

let g:NERDTreeQuitOnOpen = 0
let g:NERDTreeWinPos = "left"
let g:NERDTreeWinSize = 30
let NERDTreeIgnore = ['\~$','\.pyc$', '\.so$', '\.a$', '\.swp', '*\.swp', '\.swo', '\.swn', '\.swh', '\.swm', '\.swl', '\.swk', '\.sw*$', '[a-zA-Z]*egg[a-zA-Z]*', '[a-zA-Z]*cache[a-zA-Z]*']
let g:NERDTreeMapHelp = 'Y'

"-----------------------------
" [PLUGIN] [NERDTree] Mappings
"-----------------------------

noremap    <C-n>        :NERDTreeToggle<CR>
noremap    <C-x>        :call FocusNERDTree()<CR>

"---------------------------------
" [PLUGIN] [NERDTree] Autocommands
"---------------------------------

"Close vim if the only window left open is a NERDTree
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
      echo "True!"
      exe "normal \<C-w>p"
  else
      NERDTreeFocus
  endif
endfunction

"==============================================
 Plug 'jlanzarotta/bufexplorer'
"==============================================

"-------------------------------
" [PLUGIN] [bufExplorer] Settings
"-------------------------------

" Do not show buffers from other tabs.
let g:bufExplorerFindActive=0
let g:bufExplorerShowTabBuffer=0
let g:bufExplorerShowRelativePath=1

"--------------------------------
" [PLUGIN] [bufExplorer] Mappings
"--------------------------------

noremap <leader>o :BufExplorer<CR>
nnoremap <leader>] :bn<CR>
nnoremap <leader>[ :bp<CR>

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

nmap <leader>bb :CtrlPBuffer<cr>

"--------------------------
" [PLUGIN] [CtrlP] Commands
"--------------------------

" CtrlP refresh
command CC CtrlPClearAllCaches  

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
 Plug 'scrooloose/nerdcommenter'
"==============================================

" <empty>


"=============================================================
 Plug 'ycm-core/YouCompleteMe', { 'do': function('BuildYCM') }
"=============================================================

"----------------------------------
" [PLUGIN] [YouCompleteMe] Settings
"----------------------------------

let g:ycm_python_binary_path = '/usr/bin/python3'

"----------------------------------
" [PLUGIN] [YouCompleteMe] Mappings
"----------------------------------

inoremap <expr> <C-j> pumvisible() ? "\<C-n>" : "\<C-j>"
inoremap <expr> <C-k> pumvisible() ? "\<C-p>" : "\<C-k>"
inoremap <expr> <C-d> pumvisible() ? "\<PageDown>\<C-p>\<C-n>" : "\<C-d>"
inoremap <expr> <C-u> pumvisible() ? "\<PageUp>\<C-p>\<C-n>" : "\<C-u>"

"==============================================
 Plug 'Chiel92/vim-autoformat'
"==============================================

"-----------------------------------
" [PLUGIN] [Autoformat] Settings
"-----------------------------------

let g:autoformat_autoindent = 0
let g:autoformat_retab = 0
let g:autoformat_remove_trailing_spaces = 0
let g:formatter_yapf_style = 'pep8'

"-----------------------------------
" [PLUGIN] [Autoformat] Commands
"-----------------------------------

noremap <F6> :Autoformat<CR>

"==============================================
 Plug 'junegunn/vim-easy-align'
"==============================================

"------------------------------
" [PLUGIN] [EasyAlign] Mappings
"------------------------------

" Start interactive EasyAlign in visual mode (e.g. vipga)
xmap ga <Plug>(EasyAlign)
" Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap ga <Plug>(EasyAlign)

"==============================================
 Plug 'raimondi/delimitmate'
"==============================================

"--------------------------------
" [PLUGIN] [delimitMate] Settings
"--------------------------------

let delimitMate_expand_cr=1

"==============================================
 Plug 'scrooloose/syntastic'
"==============================================

"------------------------------
" [PLUGIN] [Syntastic] Settings
"------------------------------

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

"------------------------------
" [PLUGIN] [Syntastic] Mappings
"------------------------------

nmap     <leader>c      :SyntasticCheck<CR>

"==============================================
 Plug 'tpope/vim-surround'
"==============================================

" <empty>

"==============================================
 Plug 'SirVer/ultisnips'
"==============================================

" <empty>

"==============================================
 Plug 'tpope/vim-fugitive'
"==============================================

"-----------------------------
" [PLUGIN] [fugitive] Mappings
"-----------------------------

nnoremap <space>ga :Git add %:p<CR><CR>
nnoremap <space>gs :Gstatus<CR>
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
 Plug 'airblade/vim-gitgutter'
"==============================================

"----------------------------------
" [PLUGIN] [GitGutter] Autocommands
"----------------------------------

autocmd vimenter * :GitGutterDisable

"==============================================
 Plug 'christoomey/vim-tmux-navigator'
"==============================================

" <empty>

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
 Plug 'godlygeek/tabular'
"==============================================

" The tabular plugin must come before vim-markdown
"
" <empty>

"==============================================
 Plug 'plasticboy/vim-markdown'
"==============================================

" <empty>

"==============================================
 Plug 'suan/vim-instant-markdown'
"==============================================

"-------------------------------------
" [PLUGIN] [instant-markdown] Settings
"-------------------------------------

let g:instant_markdown_autostart = 0

"==============================================
 Plug 'python-mode/python-mode'
"==============================================

"--------------------------------
" [PLUGIN] [python-mode] Settings
"--------------------------------

let g:pymode_lint_checkers = ['pyflakes']
let g:pymode_lint_cwindow = 0
let g:pymode_lint_on_write = 0
let g:pymode_rope_complete_on_dot = 0
let g:pyflakes_use_quickfix = 0
let g:pymode_lint_cwindow = 0

"==============================================
 Plug 'mattn/emmet-vim'
"==============================================

" Key to expand: <C-y>,

"--------------------------
" [PLUGIN] [emmet] Settings
"-------------------------

let g:user_zen_settings = {
\  'indentation' : '    '
\}

"==============================================
 Plug 'pangloss/vim-javascript'
"==============================================

" <empty>

"==============================================
 Plug 'mxw/vim-jsx'
"==============================================

" <empty>

"==============================================
 Plug 'cakebaker/scss-syntax.vim'
"==============================================

" <empty>

"==============================================
 Plug 'vim-scripts/bnf.vim'
"==============================================

" <empty>

"==============================================
 Plug 'hdima/python-syntax'
"==============================================

"----------------------------------
" [PLUGIN] [python-syntax] Settings
"----------------------------------

let g:python_highlight_all = 1

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
 Plug 'thinca/vim-quickrun'
"==============================================

"*quickrun* is Vim plugin to execute whole/part of editing file and show the result.
"It provides :QuickRun command for it.
"
" <empty>

"==============================================
 Plug 'Shougo/vimproc.vim'
"==============================================

" <empty>

"==============================================
 Plug 'Shougo/vimshell.vim'
"==============================================

"vimshell depends on |vimproc|
"
" <empty>

"==============================================
 Plug 'joshdick/onedark.vim'
"==============================================

" OneDark (color theme)
"
" <empty>

"==============================================
 Plug 'ryanoasis/vim-devicons'
"==============================================

" <empty>

"---------------------------------------------------------------

" (vim-plug) Initialize plugin system 
" Automatically executes 'filetype plugin indent' on and 'syntax enable'. You can
" revert the settings after the call. e.g. 'filetype indent off', 'syntax off', etc.
call plug#end()

"===============================================================
"  TEMP
"===============================================================
" appears mostly when appending output to .vimrc

" shows how many times a search pattern occurs in the current buffer
" somewhy this settings works only when it's placed at the end of the file
set shortmess-=S

