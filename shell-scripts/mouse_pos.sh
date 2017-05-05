#!/bin/sh

eval $(xdotool getmouselocation --shell)
w=$X
h=$Y
echo $w
echo $h

