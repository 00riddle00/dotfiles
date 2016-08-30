#!/bin/sh

# command to run the app (in /usr/bin)
app_run="gitkraken"
# app name to be found in wmctrl -lx
app_name=$app_run
 
# no app started, so start one
if [ -z  "`wmctrl -lx | grep $app_name`" ]; then
    $app_name &
# app is opened, so focus on it
else
    wmctrl -a $app_name
fi;
