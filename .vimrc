set nocompatible

" Figure out what sort of color scheme we should be using. The default is
" 'dusk', my bright-on-dark scheme. If the VIMCOLOR environment variable is
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
	set background=dark
	color solarized
endif

" Make sure we're getting 256 colors when it's available
if $TERM == "xterm-256color" || $TERM == "screen-256color" || $COLORTERM == "gnome-terminal"
	set t_Co=256
endif

" Don't save backups
set nobackup

" Show matching brackets when cursor is over them
set showmatch

syntax enable

"TODO add more fonts (with if clauses), and make it
"override terminal fonts
set guifont=Terminus\ 12

set number

set encoding=utf-8

set showcmd     " Show count of selected lines or characters
set shell=/bin/sh

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

" Search
set ignorecase
set incsearch
set nohlsearch
set smartcase

" Tabs
set expandtab
set tabstop=8
set softtabstop=4
set shiftwidth=4

" Auto inent after a {
set autoindent
set smartindent

" Do not wrap lines automatically
set nowrap

" Statusline
set laststatus=2


" Mappings
noremap <c-n>       :call ToggleNERDTreeAndTagbar()<CR>
map     <leader>h   :set hlsearch!<CR>

"TODO switch <SPACE> with 0
nmap    <SPACE>     ^

noremap <leader>n :set number!<CR>

" Toggle paste mode
map <leader>p :setlocal paste!<CR>

" Easy movement between windows
"TODO change ctrl to alt
noremap <c-j> <C-W>j
noremap <c-k> <C-W>k
noremap <c-h> <C-W>h
noremap <c-l> <C-W>l

" Easy tab control
"TODO enable c-q
nmap    <c-t>       :tabnew<cr>
nmap    <c-e>       :tabclose<cr>
nmap    <c-w>       :tabnext<cr>
nmap    <c-q>       :tabprev<cr>
nmap    tt          :tabprev<cr>
nmap    <c-1>       1gt
nmap    <c-2>       2gt
nmap    <c-3>       3gt
nmap    <c-4>       4gt
nmap    <c-5>       5gt
nmap    <c-6>       6gt
nmap    <c-7>       7gt
nmap    <c-8>       8gt
nmap    <c-9>       :tablast<cr>

" Treat long lines as break lines
map j gj
map k gk

" I often hit :W when I actually mean :w
command! W write
command! Q quit

" Don't remove indentation when adding '#' comments
" TODO make it work without 'X'
inoremap # X#

" I don't even know how to use Ex mode.
nnoremap Q <nop>

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

" Get rid of annoying parenthesis matching, I prefer to use %.                                                                                                                                                      
let loaded_matchparen = 1                                                                                                                                                                                            
                                                                                                                                                                                                                     
" Disable A tag underlining                                                                                                                                                                                          
let html_no_rendering = 1   


" Plugins                                                                                                                                                                                                                                      
" =======                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                               
" How to install Vundle:                                                                                                                                                                                                                       
"                                                                                                                                                                                                                                              
"     git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim                                                                                                                                                              
"                                                                                                                                                                                                                                              
" https://github.com/gmarik/Vundle.vim                                                                                                                                                                                                         
" set the runtime path to include Vundle and initialize                                                                                                                                                                                        
"  

filetype off                                                                                                                                                                                                                                   
set rtp+=~/.vim/bundle/Vundle.vim                                                                                                                                                                                                              
call vundle#begin("~/.vim/vundle")   

Plugin 'gmarik/Vundle.vim'  

Plugin 'The-NERD-tree'                                                                                                                                                                                                                         
let g:NERDTreeQuitOnOpen = 0                                                                                                                                                                                                                   
let g:NERDTreeWinPos = "left"                                                                                                                                                                                                                 
let g:NERDTreeWinSize = 30                                                                                                                                                                                                                     
let g:NERDTreeIgnore = ['^__pycache__$', '\.egg-info$', '\~$']  

Plugin 'Tagbar'
let g:tagbar_width = 30
let g:tagbar_sort = 0

Plugin 'Python-mode-klen'                                                                                                                                                                                            
let g:pymode_lint_checkers = ['pyflakes']                                                                                                                                                                            
let g:pymode_lint_cwindow = 0                                                                                                                                                                                        
let g:pymode_lint_on_write = 0                                                                                                                                                                                       
let g:pymode_rope_complete_on_dot = 0                                                                                                                                                                                
let g:pyflakes_use_quickfix = 0                                                                                                                                                                                      
let g:pymode_lint_cwindow = 0                                                                                                                                                                                        
nmap <C-c>i :PymodeRopeAutoImport<CR>                                                                                                                                                                                

"Do not fold functions on startup
set nofoldenable
                                                                                                                                                                                                                     
"Plugin 'Syntastic'                                                                                                                                                                                                   
let g:syntastic_enable_signs = 1                                                                                                                                                                                     
let g:syntastic_disabled_filetypes = ['html']                                                                                                                                                                        
let g:syntastic_python_python_exec = '/usr/bin/python3'                                                                                                                                                              
let g:syntastic_python_checkers = ['python', 'flake8']                                                                                                                                                               
let g:syntastic_filetype_map = {'python.django': 'python'}                                                                                                                                                           
let g:syntastic_python_pep8_args = '--ignore=E501'  

Plugin 'surround.vim' 

Plugin 'delimitMate.vim'  

Plugin 'christoomey/vim-tmux-navigator'

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required

