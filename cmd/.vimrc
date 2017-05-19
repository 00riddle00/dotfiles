
"############################### UNSORTED #####################################
"
"
"
" open a NERDTree automatically when vim starts up
autocmd vimenter * NERDTree
" Focus the window and not the NERDTree (which is also opened) when vim starts up
autocmd VimEnter * wincmd p

" open a NERDTree automatically when vim starts up if no files were specified
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

" custom NERDTree arrows
" let g:NERDTreeDirArrowExpandable = '+'
" let g:NERDTreeDirArrowCollapsible = '-'
"
nmap    <leader>d       :pwd<cr>




"############################### MAIN CONFIG #####################################

"TODO add comments everywhere

" Don't save backups
set nobackup

" Show matching brackets when cursor is over them
set showmatch

" Easy movement between windows
noremap <c-j> <C-W>j
noremap <c-k> <C-W>k
noremap <c-h> <C-W>h
noremap <c-l> <C-W>l

" Tab navigation
"TODO enable c-q, c-w, c-e for tab navigation
nmap    <leader>t       :tabnew<cr>
nmap    <leader>w       :tabnext<cr>
nmap    <leader>q       :tabprev<cr>
"nmap    ??       :tabclose<cr>
nmap    <leader>1       1gt
nmap    <leader>2       2gt
nmap    <leader>3       3gt
nmap    <leader>4       4gt
nmap    <leader>0       :tablast<cr>
"nmap    <leader>r       :tabedit %<CR>

nmap    <c-t>       :tabnew<cr>
nmap    <c-w>       :tabnext<cr>
nmap    <c-q>       :tabprev<cr>
nmap    <c-e>       :tabclose<cr>
nmap    <a-1>       1gt
nmap    <a-2>       2gt
nmap    <a-3>       3gt
nmap    <a-4>       4gt
nmap    <a-0>0       :tablast<cr>
"nmap    <W-r>       :tabedit %<CR>
nmap <w-r>   <plug>NERDCommenterComment

" Toggle line numbers
nmap <leader>n :set number!<CR>

" Toggle paste mode
map <leader>p :setlocal paste!<CR>

set guitablabel=%t

set noswapfile
set nofoldenable
set nocompatible

nmap    <leader>j       :sp<cr>
nmap    <leader>v       :vs<cr>

nnoremap <leader>] :bn<CR>
nnoremap <leader>[ :bp<CR>

noremap <leader>o :BufExplorer<CR>

"noremap    <c-n>        :call ToggleNERDTreeAndTagbar()<CR>
noremap    <c-n>        :NERDTreeTabsToggle<CR>
noremap    <c-m>        :NERDTreeFocus<CR>

noremap <leader>r       :so $VIMRC<CR>

map <leader>h           :set hlsearch!<CR>
map <c-s>           :w!<CR>
map <leader>e           :e<CR>
map ss           :wq<CR>
map qq           :q<CR>

"TODO switch <SPACE> with 0
nmap    <SPACE>     ^

set encoding=utf-8
"?set fileencodings=ucs-bom,utf-8,windows-1257
set shell=/bin/sh

" Text wrapping
set textwidth=79
"?set linebreak

" Spelling
set spelllang=lt,en

" Cursor movement behaviour
set nostartofline
    " Jump 5 lines when running out of the screen
set scrolljump=5
    " Indicate jump out of the screen when 3 lines before end of the screen
set scrolloff=3

" Search
set ignorecase
set incsearch
set nohlsearch
set smartcase

" Tabs
set expandtab
set tabstop=4
set softtabstop=4
set shiftwidth=4

" Auto indent after a {
set autoindent
set smartindent

" Do not wrap lines automatically
set nowrap

" Treat long lines as break lines
map j gj
map k gk

" Autocomplete
"ino <c-k> <c-p>
"ino <c-j> <c-n>
" Scan only opened buffers and current file, makes autocompletion faster.
set complete=.,w,b,u

" I often hit :W when I actually mean :w
command! W write
"command! W! :w!
"command! Q quit
"command! Q! :q!
"command! WQ! :wq!

" Don't remove indentation when adding '#' comments
" TODO fix it
"inoremap # X#

" I don't even know how to use Ex mode.
nnoremap Q <nop>

" set it to disable hjkl keys
"noremap h <NOP>
"noremap j <NOP>
"noremap k <NOP>
"noremap l <NOP>

"############################### PLUGINS #####################################

set nocompatible              " be iMproved, required
filetype off                  " required

set rtp+=$DOTFILES_DIR/cmd/.vim/bundle/Vundle.vim                                                                                                                                                                                                              
call vundle#begin("$DOTFILES_DIR/cmd/.vim/vundle")   

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

Plugin 'jistr/vim-nerdtree-tabs'
Plugin 'godlygeek/tabular'
Plugin 'plasticboy/vim-markdown'
Plugin 'fatih/vim-go'
Plugin 'Shougo/vimproc.vim'
Plugin 'Shougo/vimshell.vim'
Plugin 'xolox/vim-misc'
Plugin 'jlanzarotta/bufexplorer'
Plugin 'powerline/powerline'
Plugin 'raimondi/delimitmate'
Plugin 'kien/ctrlp.vim'
Plugin 'tpope/vim-fugitive'
Plugin 'ervandew/supertab'
Plugin 'scrooloose/nerdcommenter'
Plugin 'tpope/vim-surround'
Plugin 'majutsushi/tagbar'
Plugin 'scrooloose/nerdtree'
Plugin 'scrooloose/syntastic'
Plugin 'klen/python-mode'
Plugin 'christoomey/vim-tmux-navigator'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" " To ignore plugin indent changes, instead use:
" "filetype plugin on

" " Brief help
" " :PluginList       - lists configured plugins
" " :PluginInstall    - installs plugins; append `!` to update or just
" :PluginUpdate
" " :PluginSearch foo - searches for foo; append `!` to refresh local cache
" " :PluginClean      - confirms removal of unused plugins; append `!` to
" auto-approve removal

" " see :h vundle for more details or wiki for FAQ
" " Put your non-Plugin stuff after this line

"############################### PLUGIN CONFIG #####################################

let g:instant_markdown_autostart = 0

let g:NERDTreeQuitOnOpen = 0                                                                                                                                                                                                                   
let g:NERDTreeWinPos = "left"                                                                                                                                                                                                                 
let g:NERDTreeWinSize = 30                                                                                                                                                                                                                     
let g:NERDTreeIgnore = ['^__pycache__$', '\.egg-info$', '\~$']  
let g:NERDTreeMapHelp = '<F1>'

let g:tagbar_width = 30
let g:tagbar_sort = 0

let g:pymode_lint_checkers = ['pyflakes']                                                                                                                                                                            
let g:pymode_lint_cwindow = 0                                                                                                                                                                                        
let g:pymode_lint_on_write = 0                                                                                                                                                                                       
let g:pymode_rope_complete_on_dot = 0                                                                                                                                                                                
let g:pyflakes_use_quickfix = 0                                                                                                                                                                                      
let g:pymode_lint_cwindow = 0                                                                                                                                                                                        
                                                                                                                                                                                                                     
let g:syntastic_enable_signs = 1                                                                                                                                                                                     
let g:syntastic_disabled_filetypes = ['html']                                                                                                                                                                        
let g:syntastic_python_python_exec = '/usr/bin/python3'                                                                                                                                                              
let g:syntastic_python_checkers = ['python', 'flake8']                                                                                                                                                               
let g:syntastic_filetype_map = {'python.django': 'python'}                                                                                                                                                           
let g:syntastic_python_pep8_args = '--ignore=E501'  

let g:ycm_python_binary_path = '/usr/bin/python3'

let g:airline#extensions#tabline#enabled = 1
let g:airline_section_b = '%{strftime("%c")}'
let g:airline_section_y = 'BN: %{bufnr("%")}'

" Do not show buffers from other tabs.
let g:bufExplorerFindActive=0
let g:bufExplorerShowTabBuffer=0
let g:bufExplorerShowRelativePath=1


" fugitive git bindings
nnoremap <space>ga :Git add %:p<CR><CR>
nnoremap <space>gs :Gstatus<CR>
nnoremap <space>gc :Gcommit -v -q<CR>
noremap <space>gt :Gcommit -v -q %:p<CR>
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


"############################### FUNCTIONS ########################################

function! ToggleNERDTreeAndTagbar()                                                                                                                                                                                  
    " Detect which plugins are open                                                                                                                                                                                  
    if exists('t:NERDTreeBufName')                                                                                                                                                                                   
        let nerdtree_open = bufwinnr(t:NERDTreeBufName) != -1                                                                                                                                                        
        let nerdtree_window = bufwinnr(t:NERDTreeBufName)                                                                                                                                                            
    else                                                                                                                                                                                                             
        let nerdtree_open = 0                                                                                                                                                                                        
        let nerdtree_window = -1                                                                                                                                                                                     
    endif                                                                                                                                                                                                            
    let tagbar_open = bufwinnr('__Tagbar__') != -1                                                                                                                                                                   
    let tagbar_window = bufwinnr('__Tagbar__')                                                                                                                                                                       
    let current_window = winnr()                                                                                                                                                                                     
                                                                                                                                                                                                                     
    " Perform the appropriate action                                                                                                                                                                                 
    if nerdtree_open && tagbar_open                                                                                                                                                                                  
        NERDTreeFind                                                                                                                                                                                                 
    elseif nerdtree_open && current_window == nerdtree_window                                                                                                                                                        
        NERDTreeToggle                                                                                                                                                                                               
        TagbarOpen                                                                                                                                                                                                   
        execute bufwinnr('__Tagbar__') . 'wincmd w'                                                                                                                                                                  
    elseif nerdtree_open                                                                                                                                                                                             
        NERDTreeFind                                                                                                                                                                                                 
    elseif tagbar_open && current_window == tagbar_window                                                                                                                                                            
        TagbarClose                                                                                                                                                                                                  
        NERDTreeToggle                                                                                                                                                                                               
        execute bufwinnr(t:NERDTreeBufName) . 'wincmd w'                                                                                                                                                             
    elseif tagbar_open                                                                                                                                                                                               
        TagbarShowTag                                                                                                                                                                                                
        execute bufwinnr('__Tagbar__') . 'wincmd w'                                                                                                                                                                  
    else                                                                                                                                                                                                             
        NERDTreeFind                                                                                                                                                                                                 
    endif                                                                                                                                                                                                            
endfunction   


function! GetBufferList()
  redir =>buflist
  silent! ls
  redir END
  return buflist
endfunction


function! ToggleList(bufname, pfx)
  let buflist = GetBufferList()
  for bufnum in map(filter(split(buflist, '\n'), 'v:val =~ "'.a:bufname.'"'), 'str2nr(matchstr(v:val, "\\d\\+"))')
    if bufwinnr(bufnum) != -1
      exec(a:pfx.'close')
      return
    endif
  endfor
  if a:pfx == 'l' && len(getloclist(0)) == 0
      echohl ErrorMsg
      echo "Location List is Empty."
      return
  endif
  let winnr = winnr()
  exec('botright '.a:pfx.'open')
  if winnr() != winnr
    wincmd p
  endif
endfunction


"############################### LOOK AND FEEL #####################################

" Figure out what sort of color scheme we should be using. 
" If the VIMCOLOR environment variable is
" set, then use that, giving preference to "solarized" for the generic
" settings of "light" or "dark".

if $VIMCOLOR == 'light'
	set background=light
	let g:solarized_termcolors=256
	color solarized
elseif $VIMCOLOR == 'dark'
	set background=dark
	let g:solarized_termcolors=256
	color solarized
elseif $VIMCOLOR == 'molokai'
	let g:molokai_original=1
	let g:rehash256=1
	color molokai
elseif $VIMCOLOR != ''
	color $VIMCOLOR
else
	set t_Co=256
	set background=dark
	color solarized
endif

" Make sure we're getting 256 colors when it's available
if $TERM == "xterm-256color" || $TERM == "screen-256color" || $COLORTERM == "gnome-terminal"
	set t_Co=256
endif

syntax enable
"TODO add more fonts (with if clauses), and make it override terminal fonts
set guifont=Terminus\ 12
"?set guioptions=irL
"?set foldmethod=marker
"?set foldlevel=20
set showcmd     " Show count of selected lines or characters
set number
"?set wildmenu
" Statusline
set laststatus=2

