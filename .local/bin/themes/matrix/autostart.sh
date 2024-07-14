#!/usr/bin/env sh

feh --bg-scale "$CANDY/images/wallpapers/matrix.jpg" 
conky -c $XDG_CONFIG_HOME/conky/stats_green > /dev/null 2>&1 &
conky -c $XDG_CONFIG_HOME/conky/clock_green > /dev/null 2>&1 &
tint2 &
urxvt -geometry 78x24 -name t1 --hold &
thunar &
mpg123 $CANDY/audio/matrix_intro.mp3 > /dev/null 2>&1 
urxvt -geometry 78x24 -name cmatrix --hold -e bash -c "sleep 0.1 && cmatrix" &
mpg123 $CANDY/audio/matrix_music.mp3 > /dev/null 2>&1 
