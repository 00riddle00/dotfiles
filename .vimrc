" If you add new plugins, install them with::
"
"     make vimpire
"
" using https://bitbucket.org/sirex/home Makefile

" TODO: add pathogen
" Pathogen is responsible for vim's runtimepath management.
"" call pathogen#infect()
""execute pathogen#infect()

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
	set t_Co=256
	set background=dark
	"TODO make this work
	"let g:solarized_termcolors=256
	"TODO install via pathogen
	color solarized
endif

" Make sure we're getting 256 colors when it's available
if $TERM == "xterm-256color" || $TERM == "screen-256color" || $COLORTERM == "gnome-terminal"
	set t_Co=256
endif

" Don't save backups
set nobackup



" Don't clear the screen after exit
"?set t_ti=
"?set t_te=


" Show matching brackets when cursor is over them
set showmatch


"--------------NOTES-------------

nnoremap <leader>] :bn<CR>
nnoremap <leader>[ :bp<CR>
"
noremap <Esc> <NOP>

noremap <leader>o :BufExplorer<CR>

"?set mouse=a

" Mappings
"?nmap    <F1>        :Gstatus<CR>
"?nmap    <F2>        :update<CR>
"?imap    <F2>        <ESC>:update<CR>a
"?nmap    <F3>        :BufExplorer<CR>
noremap    <c-n>        :call ToggleNERDTreeAndTagbar()<CR>
"?nmap    <F5>        :cnext<CR>
"?nmap    <S-F5>      :cprevious<CR>
"?nmap    <C-F5>      :cc<CR>
"?nmap    <F7>        :call ToggleList("Quickfix List", 'c')<CR>
"?nmap    <F4>        :silent Neomake!<CR>
map <leader>h           :set hlsearch!<CR>
"?nmap    <F12>       :setlocal spell!<CR>
"TODO switch <SPACE> with 0
nmap    <SPACE>     ^


"TODO mark W and Q as :w and :q

" Easy movement between windows
"TODO change ctrl to alt
noremap <c-j> <C-W>j
noremap <c-k> <C-W>k
noremap <c-h> <C-W>h
noremap <c-l> <C-W>l
"noremap <M-l> :echo "it werks!"<cr>

"TODO enable c-q
" Easy tab control
nmap    <c-t>       :tabnew<cr>
nmap    <c-e>       :tabclose<cr>
nmap    <c-w>       :tabnext<cr>
nmap    <c-q>       :tabprev<cr>
nmap    tt       :tabprev<cr>
"?nmap            :tabedit %<CR>
"nmap            :tabnew \| tjump <C-R><C-W><CR>
" map <leader>to :tabonly<CR>
" map <leader>tm :tabmove xx<CR>
"nmap    <c-1>       1gt
"nmap    <c-2>       2gt
"nmap    <c-3>       3gt
"nmap    <c-4>       4gt
"nmap    <c-5>       5gt
"nmap    <c-6>       6gt
"nmap    <c-7>       7gt
"nmap    <c-8>       8gt
"nmap    <c-9>       :tablast<cr>


"noremap   <c-n>      :set number!<cr>
noremap <leader>n :set number!<CR>

" Toggle paste mode
map <leader>p :setlocal paste!<CR>

" TODO customize
" Alt-Backspace deletes word backwards                                                                                                                                                                                                         
cnoremap        <M-BS>          <C-W>    


" Look and feel.
syntax enable
filetype indent plugin on
"TODO add more fonts (with if clauses), and make it
"override terminal fonts
set guifont=Terminus\ 12
"?set guioptions=irL
set number
"?set wildmenu
set encoding=utf-8
"?set fileencodings=ucs-bom,utf-8,windows-1257
"?set foldmethod=marker
"?set foldlevel=20
set showcmd     " Show count of selected lines or characters
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

" Auto inent after a {
set autoindent
set smartindent

" Do not wrap lines automatically
set nowrap



" Treat long lines as break lines
map j gj
map k gk

" Statusline
set laststatus=2


" Autocomplete
ino <c-k> <c-p>
ino <c-j> <c-n>
" Scan only opened buffers and current file, makes autocompletion faster.
set complete=.,w,b,u


" I often hit :W when I actually mean :w
command! W write
command! Q quit

" Don't remove indentation when adding '#' comments
" TODO fix it
"inoremap # X#

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

" Get ride of annoying parenthesis matching, I prefer to use %.                                                                                                                                                      
let loaded_matchparen = 1                                                                                                                                                                                            
                                                                                                                                                                                                                     
" Disable A tag underlining                                                                                                                                                                                          
let html_no_rendering = 1   

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

"Plugin 'Valloric/YouCompleteMe'
let g:ycm_python_binary_path = '/usr/bin/python3'

Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'

Plugin 'bufexplorer.zip'
"   Do not show buffers from other tabs.
"   let g:bufExplorerFindActive=0
"   let g:bufExplorerShowTabBuffer=0
"   let g:bufExplorerShowRelativePath=1

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required



