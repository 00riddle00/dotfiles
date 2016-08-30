#!/bin/sh

terminal_open="terminator --geometry=700x500 -T tmux -x tmux"

if [ -z  "`wmctrl -lx | grep tmux" ]; then
    $terminal_open &
else
    wmctrl -a tmux -F
fi;
