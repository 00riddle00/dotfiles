#!/usr/bin/env bash

pkill -f conky & 
pkill -f terminator &
pkill -f urxvt &
pkill -f thunar &
pkill -f mpg123 &

sed -i 's/\bprofile = .*/profile = solarized-dark/' ~/.config/terminator/config &
sleep 2 
sed -i 's/export THEME=.*/export THEME=riddle/' ~/.aliases &
ln -sf $SHELL_SCRIPTS_DIR/themes/riddle/autostart.sh $HOME/.config/openbox/autostart.sh &
sleep 2
sed -i 's/.*gtk-theme-name.*/gtk-theme-name="numix-archblue"/' ~/.gtkrc-2.0 &
sed -i 's/.*gtk-icon-theme-name.*/gtk-icon-theme-name="capitaine-icon-theme"/' ~/.gtkrc-2.0 &
sed -i 's/.*gtk-font-name.*/gtk-font-name="Source Code Pro Medium 11"/' ~/.gtkrc-2.0 &
sed -i 's/.*gtk-cursor-theme-name.*/gtk-cursor-theme-name="numix-cursor-light"/' ~/.gtkrc-2.0 &
sleep 2 
source $HOME/.config/openbox/autostart.sh
