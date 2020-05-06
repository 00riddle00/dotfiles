#!/usr/bin/env sh

feh  --bg-scale "$CANDY/images/desktop/matrix.jpg" 
conky -c $XDG_CONFIG_HOME/conky/stats_green > /dev/null 2>&1 &
conky -c $XDG_CONFIG_HOME/conky/clock_green > /dev/null 2>&1 &
tint2 &
terminator --geometry=700x500 -T t1 &
thunar &
mpg123 $CANDY/audio/matrix_intro.mp3 > /dev/null 2>&1 
terminator --geometry=700x500 -T cmatrix -e "sleep 0.1 && cmatrix" 
mpg123 $CANDY/audio/matrix_music.mp3 > /dev/null 2>&1 
