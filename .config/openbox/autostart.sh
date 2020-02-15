#!/usr/bin/env sh

$SHELL_SCRIPTS_DIR/config_monitors.sh
xscreensaver -no-splash &
feh  --bg-scale "$CANDY/images/desktop/arch0.jpg" &&
conky -c $DOTFILES_DIR/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/.conky/clock_blue > /dev/null 2>&1 &
dropbox &
flameshot &
tint2 &
urxvt -name t1 &
espeak "Welcome home, Riddle!" > /dev/null 2>&1  &&
mpg123 $CANDY/audio/star_wars.mp3 > /dev/null 2>&1 &
urxvt -geometry 90x20 -name t2 --hold -e "$SHELL_SCRIPTS_DIR/greeting.sh" &

