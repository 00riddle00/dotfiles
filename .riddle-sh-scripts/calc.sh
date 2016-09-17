#!/bin/sh

open="qalculate-gtk"
focus="qalculate"

 
# no app started, so start one
if [ -z  "`wmctrl -lx | grep $focus`" ]; then
    $open &
# app is opened, so focus on it
else
    wmctrl -x -R $focus
fi;
