#!/bin/zsh

tmux new vim -c "colorscheme molokai | e /home/riddle/Dropbox/sync/gtd/content/pages/coding/coding.md | :NERDTreeToggle %:p:h"
