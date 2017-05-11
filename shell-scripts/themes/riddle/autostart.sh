#! /bin/sh
/usr/bin/dropbox &

xrandr --output HDMI-1-1 --auto 

#autokey-gtk &
feh --bg-scale $CANDY/wallpapers/black_arch_2.jpg &
gnome-screensaver > /dev/null 2>&1 &

ps cax | grep conky > /dev/null 2>&1 
if [ $? -eq 0 ]; then
    :
else
	conky -c $DOTFILES_DIR/xorg/.conky/clock_blue > /dev/null 2>&1 &
	conky -c $DOTFILES_DIR/xorg/.conky/stats_blue > /dev/null 2>&1 &
fi


