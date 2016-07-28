#!/bin/sh

chrome="google-chrome-stable"

 
# no firefox started, so start one
if [ -z  "`wmctrl -lx | grep Chrome`" ]; then
    $chrome &
# firefox is opened, so focus on it
else
    wmctrl -a chrome
fi;
