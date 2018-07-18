#!/bin/sh

# get current mouse position
eval $(xdotool getmouselocation --shell)
w=$X
h=$Y
echo $w
echo $h

