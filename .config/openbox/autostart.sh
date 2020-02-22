#!/usr/bin/env sh

$SHELL_SCRIPTS_DIR/config_monitors.sh
xscreensaver -no-splash &
feh  --bg-scale "$CANDY/images/desktop/arch0.jpg" 
conky -c $DOTFILES_DIR/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/.conky/clock_blue > /dev/null 2>&1 &
picom -b &
dropbox &
flameshot &
tint2 &
dunst &
urxvt -name t2 &
safeeyes &
nm-applet &
