#!/usr/bin/env sh

# get current mouse position
eval $(xdotool getmouselocation --shell)
w=$X
h=$Y
echo $w $h

