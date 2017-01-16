#!/bin/sh

dolphin_open="dolphin"
dolphin_focus="dolphin"

 
# no dolphin started, so start one
if [ -z  "`wmctrl -lx | grep dolphin`" ]; then
    $dolphin_open &
# dolphin is opened, so focus on it
else
    wmctrl -x -R $dolphin_focus
fi;
