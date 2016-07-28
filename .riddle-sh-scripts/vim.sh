#!/bin/sh

window_title="vim"
terminal_open="terminator --geometry=700x500 -T $window_title -x vim"

if [ -z  "`wmctrl -lx | grep $window_title`" ]; then
    $terminal_open &
else
    wmctrl -a $window_title -F
fi;
