#!/bin/sh

app_open="konqueror ~riddle"

app_focus="konqueror"

 
# no dolphin started, so start one
if [ -z  "`wmctrl -lx | grep konqueror`" ]; then
    $app_open &
# dolphin is opened, so focus on it
else
    wmctrl -x -R $app_focus
fi;
