#!/bin/sh

dolphin_open="dolphin4"
dolphin_focus="dolphin4"

 
# no dolphin started, so start one
if [ -z  "`wmctrl -lx | grep dolphin`" ]; then
    $dolphin_open &
# dolphin is opened, so focus on it
else
    wmctrl -x -R $dolphin_focus
fi;
