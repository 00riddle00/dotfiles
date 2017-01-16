#!/bin/sh


eval $(xdotool getmouselocation --shell)
w=$X
h=$Y

xdotool search --name "BOOK" windowactivate --sync mousemove $w $h 
seq 2 | xargs -Iz xdotool click 1
xdotool key ctrl+c

xdotool search --name "AUDIO" windowactivate --sync mousemove --window %1 750 530 && xdotool click 1
xdotool key Left

xdotool search --name "LANG" windowactivate --sync mousemove --window %1 390 320 &&
seq 3 | xargs -Iz xdotool click 1

xdotool key delete
xdotool key ctrl+v
#xdotool sleep 2
xdotool search --name "LANG" windowactivate --sync mousemove --window %1 100 290 && xdotool click 1
xdotool mousemove --window %1 100 285 && xdotool click 1
xdotool sleep 1
xdotool search --name "LANG" windowactivate --sync mousemove --window %1 66 344 && xdotool click 1
#xdotool sleep 2
xdotool search --name "LANG" windowactivate --sync mousemove --window %1 502 344 && xdotool click 1

#wmctrl -a BOOK

xdotool search --name "AUDIO" windowactivate --sync mousemove --window %1 750 530 && xdotool click 1


xdotool search --name "BOOK" windowactivate --sync mousemove $w $h && xdotool click 1
#seq 2 | xargs -Iz xdotool click 1 
