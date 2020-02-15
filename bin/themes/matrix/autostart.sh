#!/usr/bin/env sh

$SHELL_SCRIPTS_DIR/config_monitors.sh
xscreensaver -no-splash &
feh  --bg-scale "$CANDY/images/desktop/matrix.jpg" &&
conky -c $DOTFILES_DIR/.conky/stats_green > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/.conky/clock_green > /dev/null 2>&1 &
dropbox &
flameshot &
tint2 &
terminator --geometry=700x500 -T t1 &
thunar &
mpg123 $CANDY/audio/matrix_intro.mp3 > /dev/null 2>&1 &&
mpg123 $CANDY/audio/matrix_music.mp3 > /dev/null 2>&1 &
terminator --geometry=700x500 -T cmatrix -e "sleep 1 && cmatrix" &

