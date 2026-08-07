"------------------------------------------------------------------------------
" Author: 00riddle00 (Tomas Giedraitis)
" Date:   2026-08-07 03:22:23 CEST
" Path:   ~/.config/obsidian/obsidian.vimrc
" URL:    https://github.com/00riddle00/dotfiles
"------------------------------------------------------------------------------

" Obsidian only looks for a vimrc file in the vault root, so symlink is needed:
"
" ln -s "${XDG_CONFIG_HOME}/obsidian/obsidian.vimrc" "${NOTES}/.obsidian.vimrc"

" Keep Vim registers local unless explicitly using + or *
set clipboard=
"set clipboard=unnamed  " <--yank to system clipboard

set tabstop=4

" Treat long lines as break lines
nmap j gj
nmap k gk

" Quickly remove search highlights
nmap <F6> :nohl<CR>

" Emulate Original gt and gT https://vimhelp.org/tabpage.txt.html#gt
exmap nextTab obcommand workspace:next-tab
exmap prevTab obcommand workspace:previous-tab
nmap gt :nextTab<CR>
nmap gT :prevTab<CR>

" Window management commands
exmap vsplit obcommand workspace:split-vertical
nmap <C-w>' :vsplit<CR>

exmap split obcommand workspace:split-horizontal
nmap <C-w>- :split<CR>

exmap focusRight obcommand editor:focus-right
nmap <C-l>  :focusRight<CR>
nmap <C-w>l :focusRight<CR>

exmap focusLeft obcommand editor:focus-left
nmap <C-h>  :focusLeft<CR>
nmap <C-w>h :focusLeft<CR>

exmap focusTop obcommand editor:focus-top
nmap <C-k>  :focusTop<CR>
nmap <C-w>k :focusTop<CR>

exmap focusBottom obcommand editor:focus-bottom
nmap <C-j>  :focusBottom<CR>
nmap <C-w>j :focusBottom<CR>

" Navigate back and forward through backlinks
exmap back obcommand app:go-back
nmap <C-o> :back<CR>
exmap forward obcommand app:go-forward
nmap <C-i> :forward<CR>

" Emulate original folding commands
exmap unfoldall obcommand editor:unfold-all
exmap togglefold obcommand editor:toggle-fold
exmap foldall obcommand editor:fold-all
exmap foldless obcommand editor:fold-less
exmap foldmore obcommand editor:fold-more
nmap zo :togglefold<CR>
nmap zc :togglefold<CR>
nmap za :togglefold<CR>
nmap zm :foldmore<CR>
nmap zM :foldall<CR>
nmap zr :foldless<CR>
nmap zR :unfoldall<CR>

"--- PLUGINS ---"
" Surround plugin keymaps (other Vim plugins don't work, unfortunately)
exmap surround_wiki surround [[ ]]
exmap surround_double_quotes surround " "
exmap surround_single_quotes surround ' '
exmap surround_backticks surround ` `
exmap surround_brackets surround ( )
exmap surround_square_brackets surround [ ]
exmap surround_curly_brackets surround { }
" NOTE: must use 'map' and not 'nmap'
map [[ :surround_wiki<CR>
nunmap s
vunmap s
map s" :surround_double_quotes<CR>
map s' :surround_single_quotes<CR>
map s` :surround_backticks<CR>
map sb :surround_brackets<CR>
map s( :surround_brackets<CR>
map s) :surround_brackets<CR>
map s[ :surround_square_brackets<CR>
map s] :surround_square_brackets<CR>
map s{ :surround_curly_brackets<CR>
map s} :surround_curly_brackets<CR>
