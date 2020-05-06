#!/usr/bin/env sh

feh  --bg-scale "$DOTFILES_DIR/images/desktop/black_striped.jpg" 
conky -c $XDG_CONFIG_HOME/conky/stats_blue > /dev/null 2>&1 &
conky -c $XDG_CONFIG_HOME/conky/clock_blue > /dev/null 2>&1 &
tint2 &
urxvt -name t2 &
espeak "Welcome home, Riddle!" > /dev/null 2>&1
urxvt -geometry 90x20 -name t2 --hold -e "$SHELL_SCRIPTS_DIR/themes/riddle/greeting.sh" &
mpg123 $CANDY/audio/star_wars.mp3 > /dev/null 2>&1
