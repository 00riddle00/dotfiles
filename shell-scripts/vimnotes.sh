#!/bin/zsh

tmux new vim -c "e /home/riddle/Dropbox/sync/gtd/coding/coding.md | :cd %:p:h | cd .. | :NERDTreeToggle %:p:h | colorscheme molokai"  
