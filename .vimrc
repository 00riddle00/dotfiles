"---------------------------------------------------
" file:     ~/.vimrc
" author:   riddle00 - https://github.com/00riddle00
" vim:fenc=utf-8:nu:ai:si:et:ts=4:sw=4:ft=vim
"---------------------------------------------------

"===================================================
"  SETTINGS 
"===================================================
color $VIMCOLOR
set background=dark

" Make sure we're getting 256 colors when it's available
if $TERM == "xterm-256color" || $TERM == "rxvt-unicode-256color" || $TERM == "screen-256color" 
    set t_Co=256
endif

" enable syntax hightlighting
syntax enable
" Show count of selected lines or characters
set showcmd     
" Show line numbers
set number
" Always show statusline
set laststatus=2
" Set mouse to work in all modes
set mouse=a
" Allow to skip between buffers without writing or abandoning changes
set hidden
" Set relative numbering
set relativenumber
" set tags location
set tags=./tags,tags;$HOME
" Don't save backups
set nobackup
" Show matching brackets when cursor is over them
set showmatch
" Do not use swap file
set noswapfile
" Do not fold text/code
set nofoldenable
" Set character encoding used inside Vim
set encoding=utf-8
" show the line number on the bar
set ruler
set shell=/bin/zsh
" Text wrapping
set textwidth=79
" Spelling
set spelllang=lt,en
" Cursor movement behaviour
set nostartofline
" Jump 5 lines when running out of the screen
set scrolljump=5
" Indicate jump out of the screen when 3 lines before end of the screen
set scrolloff=3
" Yank and copy to X clipboard
" +xterm_clipboard must be enabled (see vim --version)
set clipboard+=unnamed                  

" Search
" search ignoring case
set ignorecase
" incremental search
set incsearch
" do not highlight the search
set nohlsearch
" Override the 'ignorecase' option if the search pattern contains upper case characters. 
set smartcase

" Tabs
"Use the appropriate number of spaces to insert a <Tab>
set expandtab
" Number of spaces that a <Tab> in the file counts for.
set tabstop=4
" Number of spaces that a <Tab> counts for while performing editing operations, like inserting a <Tab> or using <BS>. 
set softtabstop=4
" How much spaces to autoindent
set shiftwidth=4

" Auto/smart indent
set autoindent smartindent

" Do not wrap lines automatically
set nowrap
" Scan only opened buffers and current file, makes autocompletion faster.
set complete=.,w,b,u

" kudos to Jason Ryan (http://jasonwryan.com)
set statusline=\ \%f%m%r%h%w\ ::\ %y\ [%{&ff}]\%=\ [%p%%:\ %l/%L]\ 

"===================================================
"  FILE SPECIFIC SETTINGS 
"===================================================
autocmd FileType markdown setlocal shiftwidth=2 tabstop=2 softtabstop=2

"===================================================
"  MAPPINGS
"===================================================
let mapleader = '\'

nmap    <leader>i       vbr=
nmap    <leader>n       :set number!<CR>
nmap    <leader>p       :setlocal paste!<CR>
nmap    <leader>v       :vs<cr>
nmap    <leader>s       :sp<cr>
nmap    <leader>d       :pwd<cr>
nmap    <C-Left>        :vertical resize -5<CR>
nmap    <C-Right>       :vertical resize +5<CR>
nmap    <C-Up>          :resize +5<CR>
nmap    <C-Down>        :resize -5<CR>
nmap    <leader>r       :so $VIMRC<CR>
nmap    <leader>h       :set hlsearch!<CR>
nmap    <C-s>           :w!<CR>
nmap     ss             :wq<CR>
nmap     qq             :q<CR>
nmap     <leader>e      :e<CR>
nmap     <F5>           :cnext<CR>
nmap     <S-F5>         :cprevious<CR>
nmap     <C-F5>         :cc<CR>
nnoremap <leader>u      :!urlview %<CR>

" Windows navigation
"nmap     <C-j>          <C-W>j
"nmap     <C-k>          <C-W>k
"nmap     <C-h>          <C-W>h
"nmap     <C-l>          <C-W>l

" Tab navigation
nmap     tt             :tabnew<CR>
nmap     te             :tabedit %<CR>
nmap     tc             :tabclose<CR>
nmap     tj             gT
nmap     tk             gt
nmap     th             :tabfirst<CR>
nmap     tl             :tablast<CR>

" Macros
let @o="oprint(\"here\")\<Esc>k0"
"let @s=":%s/\(.\+\)\n/\1@/ | sort | %s/@/\r/g <CR>"
let @q="lr lv$r=jjhr lv$r=/##"
let @e="a O11i=2xI# jo11i=2xI# Aak0"

" Copy/Paste
vmap <C-c> "+y
"vmap <C-c> "+yi
vmap <C-x> "+c
"vmap <C-v> c<ESC>"+p
"map <C-v> <ESC>"+pa

"" Long text paste
""" From primary clipboard
" nmap     tp             :r !xsel<CR>
""" From secondary clipboard
nmap     tp             :r !xsel -b<CR>

" Treat long lines as break lines
nmap    j               gj
nmap    k               gk

" I don't even know how to use Ex mode.
nmap    Q               <nop>

" Scroll half screen to left and right vertically
noremap      zh           zH
noremap      zl           zL

" Scroll half screen to left and right vertically
noremap      zz           z-

" Autocomplete
inoremap     <C-k>           <C-p>
inoremap     <C-j>           <C-n>

" Quick search for python class and def statments.
nmap    c/          /\<class
nmap    m/          /\<def

" Build DSA project 
nmap <F8> :w \| !make rebuild && ./demo <CR>
"nmap <F8> :w \| :make rebuild <CR> \| :copen 30 <CR>
"nmap <F8> :w<CR>:silent !make rebuild <CR>:silent !./demo > .tmp.xyz<CR> :tabnew<CR>:r .tmp.xyz<CR>:silent !rm .tmp.xyz<CR>:redraw!<CR>
"nmap <F8> :w<CR>:silent !chmod +x %:p<CR>:silent !%:p 2>&1 | tee ~/.vim/output<CR>:split ~/.vim/output<CR>:redraw!<CR>

"===================================================
"  COMMANDS
"===================================================
" I often hit :W when I actually mean :w
command! W              write

command Bin %!xxd
command BinRevert %!xxd -r
command Hex %!xxd -p
command HexRevert %!xxd -p -r

" remove double blank lines
command RM %s/\(\n\n\)\n\+/\1/g

" sort by markdown h1 headings 
" '@' character should not appear in a file before running
" replace \n with '@' (except the newlines appearing before '# '),
"   sort the file, then restore newlines
command SortPa %s/\n\(# \)\@!/@/g | sort | %s/@/\r/g

"===================================================
"  FUNCTIONS
"===================================================
" empty so far

"===================================================
"  PLUGINS
"===================================================
set nocompatible              " be iMproved, required
filetype off                  " required

set rtp+=$DOTFILES_DIR/.vim/bundle/Vundle.vim
call vundle#begin()

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

Plugin 'scrooloose/nerdtree'
noremap    <C-n>        :NERDTreeToggle<CR>
noremap    <C-m>        :NERDTreeFocus<CR>

let g:NERDTreeQuitOnOpen = 0
let g:NERDTreeWinPos = "left"
let g:NERDTreeWinSize = 30
let NERDTreeIgnore = ['\~$','\.pyc$', '\.so$', '\.a$', '\.swp', '*\.swp', '\.swo', '\.swn', '\.swh', '\.swm', '\.swl', '\.swk', '\.sw*$', '[a-zA-Z]*egg[a-zA-Z]*', '[a-zA-Z]*cache[a-zA-Z]*']
let g:NERDTreeMapHelp = 'Y'

"Close vim if the only window left open is a NERDTree
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
" open a NERDTree automatically when vim starts up
autocmd vimenter * NERDTree
" Focus the window and not the NERDTree (which is also opened) when vim starts up
autocmd VimEnter * wincmd p

" open a NERDTree automatically when vim starts up if no files were specified
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

Plugin 'jlanzarotta/bufexplorer'
" Do not show buffers from other tabs.
let g:bufExplorerFindActive=0
let g:bufExplorerShowTabBuffer=0
let g:bufExplorerShowRelativePath=1

nnoremap <leader>] :bn<CR>
nnoremap <leader>[ :bp<CR>

noremap <leader>o :BufExplorer<CR>

Plugin 'ctrlpvim/ctrlp.vim'

Plugin 'easymotion/vim-easymotion'
let g:EasyMotion_smartcase = 1
nmap <leader><leader> <Plug>(easymotion-overwin-f)
nmap <Leader>w <Plug>(easymotion-overwin-w)

Plugin 'scrooloose/nerdcommenter'

Plugin 'ycm-core/YouCompleteMe'
let g:ycm_python_binary_path = '/usr/bin/python3'

Plugin 'Chiel92/vim-autoformat'
let g:autoformat_autoindent = 0
let g:autoformat_retab = 0
let g:autoformat_remove_trailing_spaces = 0

let g:formatter_yapf_style = 'pep8'
noremap <F6> :Autoformat<CR>

Plugin 'raimondi/delimitmate'
let delimitMate_expand_cr=1

Plugin 'scrooloose/syntastic'
nmap     <leader>c      :SyntasticCheck<CR>

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

Plugin 'tpope/vim-surround'

Plugin 'SirVer/ultisnips'

Plugin 'tpope/vim-fugitive'
" fugitive git bindings
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

Plugin 'airblade/vim-gitgutter'
autocmd vimenter * :GitGutterDisable

Plugin 'christoomey/vim-tmux-navigator'

Plugin 'majutsushi/tagbar'
nmap <leader>b :TagbarToggle<cr>
let g:tagbar_width = 30
let g:tagbar_sort = 0

"[Markdown]
"The tabular plugin must come before vim-markdown
Plugin 'godlygeek/tabular'
Plugin 'plasticboy/vim-markdown'
Plugin 'suan/vim-instant-markdown'
let g:instant_markdown_autostart = 0

"Python
Plugin 'python-mode/python-mode'
let g:pymode_lint_checkers = ['pyflakes']
let g:pymode_lint_cwindow = 0
let g:pymode_lint_on_write = 0
let g:pymode_rope_complete_on_dot = 0
let g:pyflakes_use_quickfix = 0
let g:pymode_lint_cwindow = 0

" Former zen coding, now renamed to emmet.
" Key to expand: <C-y>,
Plugin 'mattn/emmet-vim'
let g:user_zen_settings = {
\  'indentation' : '    '
\}

" JSX support
Plugin 'pangloss/vim-javascript'
Plugin 'mxw/vim-jsx'

" ==== PLUGIN SYNTAXES ====
Plugin 'cakebaker/scss-syntax.vim'

Plugin 'vim-scripts/bnf.vim'

Plugin 'hdima/python-syntax'
let g:python_highlight_all = 1

Plugin 'octol/vim-cpp-enhanced-highlight'
"Vim tend to a have issues with flagging braces as errors,
"see for example https://github.com/vim-jp/vim-cpp/issues/16.
"A workaround is to set:
let c_no_curly_error=1

"*quickrun* is Vim plugin to execute whole/part of editing file and show the result.
"It provides :QuickRun command for it.
Plugin 'thinca/vim-quickrun'

"vimshell depends on |vimproc|
Plugin 'Shougo/vimproc.vim'
Plugin 'Shougo/vimshell.vim'

" All plugins must be added before the following line
call vundle#end()            " required
" Enable filetype-specific plugins
filetype plugin indent on    " required

" color themes
Plugin 'dracula/vim'
Plugin 'hzchirs/vim-material'
Plugin 'joshdick/onedark.vim'

" icon theme
Plugin 'ryanoasis/vim-devicons'

"===================================================
"  PLUGIN COMMANDS
"===================================================
" empty so far

"===================================================
"  PLUGIN FUNCTIONS
"===================================================
" NERDTrees File highlighting
function! NERDTreeHighlightFile(extension, fg, bg, guifg, guibg)
    exec 'autocmd filetype nerdtree highlight ' . a:extension .' ctermbg='. a:bg .' ctermfg='. a:fg .' guibg='. a:guibg .' guifg='. a:guifg
    exec 'autocmd filetype nerdtree syn match ' . a:extension .' #^\s\+.*'. a:extension .'$#'
endfunction

" Dracula theme:
function! s:Dra()
    colorscheme dracula
    set background=light
    set background=dark
endfunction
command Dra call s:Dra()


"===================================================
"  TEMP
"===================================================
" appears mostly when appending output to .vimrc
