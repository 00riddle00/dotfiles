#!/bin/sh

sed -i 's/.* profile.*/      profile = solarized-dark/' ~/.config/terminator/config &
sed -i 's/.*gtk-theme-name.*/gtk-theme-name="BBstyle"/' ~/.gtkrc-2.0 &
sed -i 's@.*color_scheme.*@      "color_scheme": "Packages/Color Scheme - Default/Solarized (Dark).tmTheme",@' /home/riddle/.config/sublime-text-2/Packages/User/Preferences.sublime-settings 
killall terminator &
killall thunar &
killall mpg123 &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T t1 &
feh --bg-scale ~/.riddle-candy/wallpapers/black-wallpaper.jpg & 
conky -c ~/.conky/archconky &
