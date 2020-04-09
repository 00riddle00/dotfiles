#!/usr/bin/env sh

# apps are mainly started via ~/.xinitrc
feh  --bg-scale "$CANDY/images/desktop/arch0.jpg" 
conky -c $XDG_CONFIG_HOME/conky/stats_blue > /dev/null 2>&1 &
conky -c $XDG_CONFIG_HOME/conky/clock_blue > /dev/null 2>&1 &
# picom -b &
tint2 &
openbox-vimnotes &
# urxvt -name t2 &
