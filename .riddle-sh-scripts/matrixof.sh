#!/bin/sh

sed -i 's/.* profile.*/      profile = solarized-dark/' ~/.config/terminator/config &
killall terminator &
killall thunar &
killall mpg123 &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T t1 &
feh --bg-scale ~/candy/arch.png &                                        
conky -c ~/.conky/archconky &
