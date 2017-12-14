

"############################### MAIN CONFIG #####################################

"Get rid of annoying parenthesis matching, I prefer to use %. (not my words, but the words of a great programmer and expert vim user)
"let loaded_matchparen = 1

" Set mouse work in all modes
" I use it to allow vim mouse scroll instead of tmux history buffer scroll
set mouse=a

" Allow to skip between buffers without writing or
" abandoning changes
set hidden

set relativenumber

noremap ] }
noremap [ {

" set tags location
set tags=./tags,tags;$HOME

map    <leader>d       :pwd<cr>

" Don't save backups
set nobackup

" Show matching brackets when cursor is over them
set showmatch

noremap <c-Left> :vertical resize -5<CR>
noremap <c-Right> :vertical resize +5<CR>

noremap <c-Up> :resize +5<CR>
noremap <c-Down> :resize -5<CR>

"nmap { :cp<CR>
"nmap } :cn<CR>

" Easy movement between windows
nmap <c-j> <C-W>j
nmap <c-k> <C-W>k
nmap <c-h> <C-W>h
nmap <c-l> <C-W>l
"noremap <c-j> <C-W>j
"noremap <c-k> <C-W>k
"noremap <c-h> <C-W>h
"noremap <c-l> <C-W>l

" Tab navigation
nmap    <leader>t       :tabnew<cr>
nmap    <leader>1       :tabfirst<cr>

nmap    <leader>q       :tabprev<cr>
nmap    <leader>w       :tabnext<cr>
nmap    <leader>f       :tabclose<cr>

nmap    <leader>3       3gt
nmap    <leader>4       4gt
nmap    <leader>5       5gt
nmap    <leader>6       6gt

nmap    <leader>0       :tabfirst<cr>
nmap    <leader>9       :tablast<cr>


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

noremap <leader>r       :so $VIMRC<CR>

map <leader>h           :set hlsearch!<CR>
map <c-s>           :w!<CR>
map <leader>e           :e<CR>
map ss           :wq<CR>
map qq           :q<CR>

"TODO switch <SPACE> with 0
nmap    <SPACE>     ^

set encoding=utf-8
set fillchars+=vert:\|
"?set fileencodings=ucs-bom,utf-8,windows-1257
set ruler

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


"############################### LOOK AND FEEL #####################################

" Figure out what sort of color scheme we should be using.
" If the VIMCOLOR environment variable is
" set, then use that, giving preference to "solarized" for the generic
" settings of "light" or "dark".

color molokai
set background=dark

"if $VIMCOLOR == 'solarized-light'
"set background=light
"let g:solarized_termcolors=256
"color solarized
"elseif $VIMCOLOR == 'solarized-dark'
"set background=dark
"let g:solarized_termcolors=256
"color solarized
"elseif $VIMCOLOR == 'molokai'
"let g:molokai_original=1
"let g:rehash256=1
"color molokai
"elseif $VIMCOLOR != ''
"color $VIMCOLOR
"else
"set background=dark
"let g:solarized_termcolors=256
"color solarized
"endif

" Make sure we're getting 256 colors when it's available
if $TERM == "xterm-256color" || $TERM == "screen-256color" || $COLORTERM == "gnome-terminal"
    set t_Co=256
endif

" enable syntax hightlighting
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



"############################### PLUGINS #####################################

set nocompatible              " be iMproved, required
filetype off                  " required

set rtp+=$DOTFILES_DIR/cmd/.vim/bundle/Vundle.vim
call vundle#begin()
"call vundle#begin("$DOTFILES_DIR/cmd/.vim/vundle")

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'
Plugin 'scrooloose/nerdtree'
Plugin 'jlanzarotta/bufexplorer'
Plugin 'kien/ctrlp.vim'
Plugin 'easymotion/vim-easymotion'
Plugin 'terryma/vim-multiple-cursors'
Plugin 'scrooloose/nerdcommenter'
Plugin 'Valloric/YouCompleteMe'
Plugin 'Chiel92/vim-autoformat'
Plugin 'raimondi/delimitmate'
Plugin 'scrooloose/syntastic'
Plugin 'tpope/vim-surround'
Plugin 'SirVer/ultisnips'
Plugin 'tpope/vim-fugitive'
Plugin 'airblade/vim-gitgutter'
Plugin 'christoomey/vim-tmux-navigator'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'
Plugin 'majutsushi/tagbar'
"Markdown
Plugin 'godlygeek/tabular'
Plugin 'plasticboy/vim-markdown'
"Python
Plugin 'python-mode/python-mode'
" ==== PLUGIN SYNTAXES ====
Plugin 'cakebaker/scss-syntax.vim'
Plugin 'hdima/python-syntax'

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
"
"exclude/include plugins on runtime
"vim --cmd "let g:loaded_<pluginname>=1"
"
"
"#######################Plugin "'scrooloose/nerdtree'##################
"
""noremap    <c-n>        :call ToggleNERDTreeAndTagbar()<CR>
noremap    <c-n>        :NERDTreeToggle<CR>
noremap    <c-m>        :NERDTreeFocus<CR>
"
let g:NERDTreeQuitOnOpen = 0
let g:NERDTreeWinPos = "left"
let g:NERDTreeWinSize = 30
let NERDTreeIgnore = ['^__pycache__$', '\.egg-info$', '\~$','\.pyc$', '\.o$', '\.so$', '\.a$', '\.swp', '*\.swp', '\.swo', '\.swn', '\.swh', '\.swm', '\.swl', '\.swk', '\.sw*$', '[a-zA-Z]*egg[a-zA-Z]*', '[a-zA-Z]*cache[a-zA-Z]*']
let g:NERDTreeMapHelp = 'Y'
" NERDTress File highlighting
function! NERDTreeHighlightFile(extension, fg, bg, guifg, guibg)
    exec 'autocmd filetype nerdtree highlight ' . a:extension .' ctermbg='. a:bg .' ctermfg='. a:fg .' guibg='. a:guibg .' guifg='. a:guifg


    exec 'autocmd filetype nerdtree syn match ' . a:extension .' #^\s\+.*'. a:extension .'$#'
endfunction

"Close vim if the only window left open is a NERDTree
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
" open a NERDTree automatically when vim starts up
autocmd vimenter * NERDTree
" Focus the window and not the NERDTree (which is also opened) when vim starts up
autocmd VimEnter * wincmd p

" open a NERDTree automatically when vim starts up if no files were specified
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

"call NERDTreeHighlightFile('jade', 'green', 'none', 'green', '#151515')
"call NERDTreeHighlightFile('ini', 'yellow', 'none', 'yellow', '#151515')
"call NERDTreeHighlightFile('md', 'blue', 'none', '#3366FF', '#151515')
"call NERDTreeHighlightFile('yml', 'yellow', 'none', 'yellow', '#151515')
"call NERDTreeHighlightFile('config', 'yellow', 'none', 'yellow', '#151515')
"call NERDTreeHighlightFile('conf', 'yellow', 'none', 'yellow', '#151515')
"call NERDTreeHighlightFile('json', 'yellow', 'none', 'yellow', '#151515')
"call NERDTreeHighlightFile('html', 'yellow', 'none', 'yellow', '#151515')
"call NERDTreeHighlightFile('styl', 'cyan', 'none', 'cyan', '#151515')
"call NERDTreeHighlightFile('css', 'cyan', 'none', 'cyan', '#151515')
"call NERDTreeHighlightFile('coffee', 'Red', 'none', 'red', '#151515')
"call NERDTreeHighlightFile('js', 'Red', 'none', '#ffa500', '#151515')
"call NERDTreeHighlightFile('php', 'Magenta', 'none', '#ff00ff', '#151515')
"
" custom NERDTree arrows
" let g:NERDTreeDirArrowExpandable = '+'
" let g:NERDTreeDirArrowCollapsible = '-'
"
" other NERDTree options
"
" NERDTreeHijackNetrw
" NERDTreeCaseSensitiveSort
" NERDTreeSortHiddenFirst
" NERDTreeIgnore
" NERDTreeRespectWildIgnore
" NERDTreeBookmarksFile
" NERDTreeBookmarksSort
" NERDTreeShowLineNumbers
" NERDTreeSortOrder
" NERDTreeStatusline
" NERDTreeCascadeSingleChildDir
" NERDTreeCascadeOpenSingleChildDir
" NERDTreeAutoDeleteBuffer
" NERDTreeRender



"
"
"#######################Plugin "'jlanzarotta/bufexplorer'##################
"
" Do not show buffers from other tabs.
let g:bufExplorerFindActive=0
let g:bufExplorerShowTabBuffer=0
let g:bufExplorerShowRelativePath=1

nnoremap <leader>] :bn<CR>
nnoremap <leader>[ :bp<CR>

noremap <leader>o :BufExplorer<CR>



"#######################Plugin "'kien/ctrlp.vim'##################

"Plugin ''
"do not load certain plugin
"set rtp+=$DOTFILES_DIR/cmd/.vim/vundle/ctrlp.vim
"let g:loaded_ctrlp=1
"
"
"#######################Plugin 'easymotion/vim-easymotion'##################
let g:EasyMotion_do_mapping = 0
let g:EasyMotion_smartcase = 1
nmap f <Plug>(easymotion-s)

"#######################Plugin "'Valloric/YouCompleteMe'##################
let g:ycm_python_binary_path = '/usr/bin/python3'


"#######################Plugin "'Chiel92/vim-autoformat'##################
let g:autoformat_autoindent = 0
let g:autoformat_retab = 0
let g:autoformat_remove_trailing_spaces = 0

let g:formatter_yapf_style = 'pep8'
noremap <F6> :Autoformat<CR>

"#######################Plugin "'raimondi/delimitmate'##################
let delimitMate_expand_cr=1

"#######################Plugin "'scrooloose/syntastic'##################
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


"#######################Plugin "'Plugin 'SirVer/ultisnips' '##################
let g:UltiSnipsExpandTrigger="<A-ENTER>"
let g:UltiSnipsJumpForwardTrigger="<A-ENTER>"
let g:UltiSnipsJumpBackwardTrigger="<A-BACKSPACE>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"





"#######################Plugin "'majutsushi/tagbar'##################
let g:tagbar_width = 30
let g:tagbar_sort = 0

"#######################Plugin "'tpope/vim-fugitive'##################
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


"#######################Plugin "'airblade/vim-gitgutter'##################
autocmd vimenter * :GitGutterDisable
"#######################Plugin "'vim-airline/vim-airline'##################
let g:airline#extensions#tabline#enabled = 1
"let g:airline_section_b = '%{strftime("%c")}'
"let g:airline_section_y = 'BN: %{bufnr("%")}'

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

let g:airline_powerline_fonts = 1
let g:Powerline_symbols = 'fancy'

"let g:airline_left_sep = '»'
"let g:airline_left_sep = '||||'
"let g:airline_right_sep = '«'
"let g:airline_right_sep = '|||||'
"let g:airline_left_sep = '▶'
"let g:airline_right_sep = '◀'
"let g:airline_theme='bubblegum'
let g:airline_theme='kolor'
"let g:airline_theme='monochrome'
"
"
"#######################Plugin "'Plugin 'majutsushi/tagbar' '##################
nmap <leader>b :TagbarToggle<CR>
"
"#######################Plugin "'plasticboy/vim-markdown'##################
let g:instant_markdown_autostart = 0

"#######################Plugin "'python-mode/python-mode'##################
let g:pymode_lint_checkers = ['pyflakes']
let g:pymode_lint_cwindow = 0
let g:pymode_lint_on_write = 0
let g:pymode_rope_complete_on_dot = 0
let g:pyflakes_use_quickfix = 0
let g:pymode_lint_cwindow = 0



