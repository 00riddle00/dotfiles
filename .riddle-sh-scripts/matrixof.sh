#!/bin/sh

sed -i 's/.* profile.*/      profile = solarized-dark/' ~/.config/terminator/config &
pkill terminator &
killall thunar &
killall mpg123 &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T t1 &
feh --bg-scale ~/candy/debian3.png &                                        
conky -c ~/.conky/archconky &
