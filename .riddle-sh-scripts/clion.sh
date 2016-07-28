#!/bin/sh

obj="clion"

 
# no firefox started, so start one
if [ -z  "`wmctrl -lx | grep clion`" ]; then
   ~/programs/clion-2016.1.1/bin/clion.sh &
# firefox is opened, so focus on it
else
    wmctrl -a clion
fi;
