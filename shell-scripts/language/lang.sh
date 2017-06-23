#!/bin/sh

eval $(xdotool getmouselocation --shell)
w=$X
h=$Y

xdotool search --name "BOOK" windowactivate &&
seq 2 | xargs -Iz xdotool click 1
xdotool key ctrl+c

#xdotool sleep 1
#xdotool search --name "AUDIO" windowactivate --sync mousemove --window %1 750 530 && xdotool click 1
xdotool mousemove 1680 760 && xdotool click 1

xdotool key Left
#xdotool sleep 1

xdotool search --name "LANG" windowactivate --sync mousemove --window %1 390 320 &&
xdotool click 1
#seq 2 | xargs -Iz xdotool click 1

#xdotool sleep 1
xdotool key ctrl+a
#xdotool sleep 1
xdotool key delete
xdotool key ctrl+v

#xdotool sleep 1
xdotool search --name "LANG" windowactivate --sync mousemove --window %1 100 600 && xdotool click 1

# TODO sleep for less
xdotool sleep 1
xdotool search --name "LANG" windowactivate --sync mousemove --window %1 65 344 && xdotool click 1

#xdotool sleep 1
xdotool search --name "LANG" windowactivate --sync mousemove --window %1 502 344 && xdotool click 1


xdotool sleep 2
#xdotool search --name "AUDIO" windowactivate --sync mousemove --window %1 750 530 && xdotool click 1
xdotool mousemove 1680 760 && xdotool click 1

#xdotool sleep 1
xdotool search --name "BOOK" windowactivate --sync mousemove $w $h &&
seq 2 | xargs -Iz xdotool click 1 

