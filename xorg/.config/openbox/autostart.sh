#! /bin/sh
xrandr --output HDMI-1-1 --auto &&
conky -c $DOTFILES_DIR/xorg/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/xorg/.conky/clock_blue > /dev/null 2>&1 &
xrdb ~/.Xresources && 
feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/black_arch_2.jpg" && 
urxvt -name t2
