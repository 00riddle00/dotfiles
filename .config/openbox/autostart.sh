#!/usr/bin/env bash
# vim:ft=bash:tw=79
#==============================================================================
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-04-05 21:14:30 EEST
# Path:   ~/.config/openbox/autostart.sh
# URL:    https://github.com/00riddle00/dotfiles
#==============================================================================
#*
# These user-specific things are run when an Openbox X Session is started.
#**

xsetroot -solid "#073542" &
#conky -c $XDG_CONFIG_HOME/conky/stats_blue > /dev/null 2>&1 &
#conky -c $XDG_CONFIG_HOME/conky/clock_blue > /dev/null 2>&1 &
tint2 &
urxvt -name t2 &
#espeak "Welcome home, Riddle!" > /dev/null 2>&1
#urxvt -geometry 90x20 -name t2 --hold -e "$BIN/themes/riddle/greeting" &
#mpg123 $CANDY/audio/star_wars.mp3 > /dev/null 2>&1
