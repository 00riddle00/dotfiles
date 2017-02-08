#!/bin/sh

sed -i 's/.* profile.*/      profile = matrix/' ~/.config/terminator/config &
killall terminator &
sed -i 's/.*gtk-theme-name.*/gtk-theme-name="Matrix_mine"/' ~/.gtkrc-2.0 &
sed -i 's@.*color_scheme.*@    "color_scheme": "Packages/candy/ILMHackers.tmTheme",@' /home/riddle/.config/sublime-text-2/Packages/User/Preferences.sublime-settings 
thunar &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T matrix_1 &
/usr/bin/python2 /usr/bin/terminator --geometry=700x500 -T matrix_2 -e cmatrix &
mpg123 ~/matrix/matrix.mp3 & feh --bg-scale ~/matrix/matrix.jpg &
killall conky & 


