#! /bin/sh
#xset -b
#xrandr --output HDMI-1-1 --auto &&
#(sleep 2s && feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch5.jpg") & 
#(sleep 2s && conky -c $DOTFILES_DIR/xorg/.conky/stats_blue > /dev/null 2>&1) &
#(sleep 2s && conky -c $DOTFILES_DIR/xorg/.conky/clock_blue_full > /dev/null 2>&1) &
#(sleep 2s && urxvt -name t2) &
#tint2

xrandr --output HDMI-1-1 --auto &&
conky -c $DOTFILES_DIR/xorg/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/xorg/.conky/clock_blue_full > /dev/null 2>&1 &
feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch5.jpg" && 
urxvt -name t2 &&
tint2

# previous fancy start
#xrandr --output HDMI-1-1 --auto &&
#conky -c $DOTFILES_DIR/xorg/.conky/stats_blue > /dev/null 2>&1 &
#conky -c $DOTFILES_DIR/xorg/.conky/clock_blue_full > /dev/null 2>&1 &
#conky -c $DOTFILES_DIR/xorg/.conky/inline_stats_blue > /dev/null 2>&1 &
#xrdb ~/.Xresources && 
#feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch5.jpg" && 
#espeak "Welcome home, Riddle!" > /dev/null 2>&1  &&
#urxvt -e cmatrix &
#mpg123 $CANDY/startup_sounds/star_wars.mp3 > /dev/null 2>&1 &&
#feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch5.jpg" && 
#killall urxvt &&
#urxvt -name t2
