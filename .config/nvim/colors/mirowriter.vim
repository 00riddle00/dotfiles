"------------------------------------------------------------------------------
" User: 00riddle00 (Tomas Giedraitis)
" Date:   2024-07-28 18:34:44 EEST
" Path: ~/.config/nvim/colors/mirowriter.vim
" URL:  https://github.com/00riddle00/dotfiles
"------------------------------------------------------------------------------
" Author: jasonwryan (Jason Ryan) (https://jasonwryan.com/)
" Orig. URL: https://hg.sr.ht/~jasonwryan/shiv/raw/.vim/colors/mirowriter.vim?rev=2cbeb4b9c04f1ece3cf54cb5e90d431a9f78663a
" Orig. URL/File Retrieval: 2017-06-28 20:37:04 EEST
" -------------------------------------------------
" Description from the author:
" -------------------------------------------------
" Adpated colouscheme for DistractFree plugin
" Author:   Jason Ryan
" URL:      https://jasonwryan.com
"------------------------------------------------------------------------------

set background=dark
hi clear
if exists("syntax_on")
    syntax reset
endif
let g:colors_name="mirowriter"

hi Normal      ctermfg=15 ctermbg=232
hi Ignore      ctermfg=8
hi Statement   ctermfg=4
hi Float       ctermfg=3
hi Constant    ctermfg=13
hi Identifier  ctermfg=12
hi Type        ctermfg=6
hi String      ctermfg=2
hi Boolean     ctermfg=3
hi Number      ctermfg=14
hi Special     ctermfg=2
hi SpecialChar ctermfg=9
hi Scrollbar   ctermfg=0
hi Cursor      ctermfg=5
hi Directory   ctermfg=12
hi Title       ctermfg=3
hi PreProc     ctermfg=10
hi LineNr      ctermfg=8
hi Comment     ctermfg=7
hi NonText     ctermfg=16
hi WarningMsg  ctermfg=9  ctermbg=15
hi ErrorMsg    ctermfg=1  ctermbg=11
hi Visual      ctermfg=8  ctermbg=15
hi Search      ctermfg=1  ctermbg=15
hi IncSearch   ctermfg=1  ctermbg=15
hi Cursorline  ctermfg=0  ctermbg=233
hi Folded      ctermfg=6  ctermbg=0   cterm=reverse

" Reset by distract free
hi NonText   ctermfg=232 ctermbg=232
hi VertSplit ctermfg=232 ctermbg=0

" Spell checking  ---
if version >= 700
  hi clear SpellBad
  hi clear SpellCap
  hi clear SpellRare
  hi clear SpellLocal
  hi       SpellBad   ctermfg=9
  hi       SpellCap   ctermfg=3
  hi       SpellRare  ctermfg=13
  hi       SpellLocal cterm=None
endif
