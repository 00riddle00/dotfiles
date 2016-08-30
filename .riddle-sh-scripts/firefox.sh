#!/bin/sh

firefox="firefox"

 
# no firefox started, so start one
if [ -z  "`wmctrl -lx | grep Firefox`" ]; then
    $firefox &
# firefox is opened, so focus on it
else
    wmctrl -x -R $firefox
fi;
