#!/bin/sh

gimp_open="gimp"
gimp_focus="gimp"

 
# no gimp started, so start one
if [ -z  "`wmctrl -lx | grep gimp`" ]; then
    $gimp_open &
# gimp is opened, so focus on it
else
    wmctrl -x -R $gimp_focus
fi;
