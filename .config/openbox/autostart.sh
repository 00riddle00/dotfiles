#!/usr/bin/env sh

$SHELL_SCRIPTS_DIR/config_monitors.sh
xscreensaver -no-splash &
feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch4.jpg" && 
conky -c $DOTFILES_DIR/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/.conky/clock_blue > /dev/null 2>&1 &
dropbox &
flameshot &
nm-applet &
tint2 &
urxvt -name t2
# espeak "Welcome home, Riddle!" > /dev/null 2>&1  &&
# mpg123 $CANDY/startup_sounds/star_wars.mp3 > /dev/null 2>&1 &
# timeout 30s urxvt -name matrix -e cmatrix

