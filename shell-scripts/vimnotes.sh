#!/bin/zsh

tmux new vim -c "e /home/riddle/Dropbox/sync/gtd/coding/koding.md | :cd %:p:h | cd .. | :NERDTreeToggle %:p:h | colorscheme solarized | AirlineTheme kolor"  
