#! /bin/sh

xrandr --output HDMI-1 --auto 

#autokey-gtk &
feh --bg-scale $CANDY/wallpapers/matrix_3.jpg &
gnome-screensaver > /dev/null 2>&1 &

#!/bin/bash
ps cax | grep conky > /dev/null 2>&1 
if [ $? -eq 0 ]; then
    :
else
	conky -c $DOTFILES_DIR/xorg/.conky/stats_green > /dev/null 2>&1 &
fi


ps cax | grep tint2 > /dev/null 2>&1 
if [ $? -eq 0 ]; then
    :
else
    :
fi

