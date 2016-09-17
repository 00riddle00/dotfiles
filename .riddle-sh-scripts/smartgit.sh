#!/bin/sh

dolphin_open="/usr/bin/smartgit"
dolphin_focus="smartgit"

 
# no dolphin started, so start one
if [ -z  "`wmctrl -lx | grep SmartGit`" ]; then
    $dolphin_open &
# dolphin is opened, so focus on it
else
    wmctrl -x -R $dolphin_focus
fi;
