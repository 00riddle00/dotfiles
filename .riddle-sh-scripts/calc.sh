#!/bin/sh

open="qalculate"
focus="qalculate"

 
# no app started, so start one
if [ -z  "`wmctrl -lx | grep qalculate`" ]; then
    $open &
# app is opened, so focus on it
else
    wmctrl -x -R $focus
fi;
