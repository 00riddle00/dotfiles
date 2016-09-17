#!/bin/sh

# command to run the app (in /usr/bin)
app_run="feh /home/riddle/c1/il.png"
# app name to be found in wmctrl -lx
app_name="feh"
 
# no app started, so start one
if [ -z  "`wmctrl -lx | grep feh`" ]; then
    $app_run &
# app is opened, so focus on it
else
    wmctrl -a $app_name
fi;
