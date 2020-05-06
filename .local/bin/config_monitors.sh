#!/usr/bin/env sh

## check if X is running
if xset q &>/dev/null; then

    ## Configure display
    ## if monitor is connected, use it. Else use laptop's screen.
    xrandr | awk '/ connected/{print $1}' | grep $HDMI_SCREEN > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        xrandr --output $HDMI_SCREEN --auto
        xrandr --output $LAPTOP_SCREEN --off
        :
    else
        xrandr --output $LAPTOP_SCREEN --auto
    fi;
fi;
