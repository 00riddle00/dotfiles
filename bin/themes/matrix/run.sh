#!/usr/bin/env bash

pkill -f conky & 
pkill -f terminator &
pkill -f urxvt &
pkill -f thunar &
pkill -f mpg123 &

sed -i 's/\bprofile = .*/profile = matrix/' ~/.config/terminator/config &
sleep 2 
sed -i 's/export THEME=.*/export THEME=matrix/' ~/.aliases &
ln -sf $SHELL_SCRIPTS_DIR/themes/matrix/autostart.sh $HOME/.config/openbox/autostart.sh
sleep 2 
sed -i 's/.*gtk-theme-name.*/gtk-theme-name="matrix_1"/' ~/.gtkrc-2.0 &
sed -i 's/.*gtk-icon-theme-name.*/gtk-icon-theme-name="ultra-flat-green"/' ~/.gtkrc-2.0 &
#sed -i 's/.*gtk-font-name.*/gtk-font-name="Source Code Pro Medium 11"/' ~/.gtkrc-2.0 &
#sed -i 's/.*gtk-cursor-theme-name.*/gtk-cursor-theme-name="numix-cursor-light"/' ~/.gtkrc-2.0 &
sleep 2 
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -p matrix -T t1 &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -p matrix -T cmatrix -e
cmatrix &
mpg123 /home/riddle/.riddle/.riddle-candy/startup_sounds/matrix.mp3 &
thunar &
