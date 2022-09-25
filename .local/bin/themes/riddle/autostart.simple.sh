#!/usr/bin/env sh

feh  --bg-scale "$CANDY/images/desktop/black_striped.jpg" 
conky -c $XDG_CONFIG_HOME/conky/stats_blue > /dev/null 2>&1 &
conky -c $XDG_CONFIG_HOME/conky/clock_blue > /dev/null 2>&1 &
tint2 &
urxvt -name t2 &
