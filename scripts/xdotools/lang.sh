#!/bin/sh

# script which aids in learning language (screen geometry is hardcoded)

# [user action] preparation steps:
# [1] arrange google chrome windows on the screen according to the screenshot
# screenshot is provided in the same folder as this script
# [2] use RenameTab chrome extension and rename tabs accordingly to the
# screenshot

# save current mouse cursor location
eval $(xdotool getmouselocation --shell)
w=$X
h=$Y

# [user action] move cursor on the current word to translate
# click mouse two times (3 actually, since 2 click happen too fast)
xdotool click --repeat 3 1
xdotool key ctrl+c
# move mouse to the center of chrome window with youtube video playing the
# audiobook, and stop the video
xdotool mousemove 1729 727 && xdotool click 1
# revert video back 2-3 seconds by pressing "ArrowLeft"
# xdotool key Left
# go to GoogleTranslate tab, clear current input and paste the new word
xdotool search --name "LANG" windowactivate --sync mousemove 179 238 
xdotool click 1
xdotool key ctrl+a
xdotool key delete
xdotool key ctrl+v

# after some time, play audiobook on youtube again and return to the original
# mouse position
sleep 6
xdotool mousemove 1729 727 && xdotool click 1
xdotool search --name "BOOK" windowactivate --sync mousemove $w $h 

# after listening exercise is done, copy words from Google Translate history 
# to your notes.
