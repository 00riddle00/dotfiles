#!/bin/sh

sed -i 's/.* profile.*/      profile = matrix/' ~/.config/terminator/config &
killall terminator &
thunar &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T matrix_1 &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T matrix_2 -e cmatrix &
mpg123 ~/matrix/matrix.mp3 & feh --bg-scale ~/matrix/matrix.jpg &
killall conky & 


