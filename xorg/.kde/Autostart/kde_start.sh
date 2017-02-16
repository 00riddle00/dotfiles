#! /bin/sh

# OSOS 2 screens atomik
xrandr --output HDMI-1 --auto --output DVI-D-1 --auto --right-of HDMI-1 &

autokey-gtk &
gnome-screensaver & 
