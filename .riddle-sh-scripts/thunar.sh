#!/bin/sh

dolphin_open="thunar"
dolphin_focus="thunar"

 
# no dolphin started, so start one
if [ -z  "`wmctrl -lx | grep thunar`" ]; then
    $dolphin_open &
# dolphin is opened, so focus on it
else
    wmctrl -x -R $dolphin_focus
fi;
