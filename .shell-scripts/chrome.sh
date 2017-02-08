#!/bin/sh

app_name="chrome"

 
# no app is, so start one
if [ -z  "`wmctrl -lx | grep -i $app_name`" ]; then
    $app_name &
# app is opened, so focus on it
else
    wmctrl -x -R $app_name
fi;
