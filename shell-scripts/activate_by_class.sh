#!/bin/sh

window_name="$1"

if [ -z "$2" ]; then
    command_name=$window_name
else
    command_name="$2"
fi

# no app is running, so start one
if [ -z  "`wmctrl -lx | grep -i $window_name`" ]; then
    $command_name &
else
# app is opened, so focus on it
    # wmctrl -x -R $app_name - alternative command (longer, but accurate)
    wmctrl -x -a $window_name
fi;
