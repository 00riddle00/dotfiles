#! /bin/sh

## check if X is running
if xset q &>/dev/null; then

    ## Configure display
    ## if monitor is connected, use it. Else use laptop's screen.
    xrandr | awk '/ connected/{print $1}' | grep $HDMI_SCREEN > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        xrandr --output $HDMI_SCREEN --auto
        xrandr --output $LAPTOP_SCREEN --off
        :
    else
        xrandr --output $LAPTOP_SCREEN --auto
    fi;
fi;

xscreensaver -no-splash &
feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch5.jpg" && 
conky -c $DOTFILES_DIR/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/.conky/clock_blue > /dev/null 2>&1 &
dropbox &
flameshot &
nm-applet &
tint2 &
urxvt -name t2
# espeak "Welcome home, Riddle!" > /dev/null 2>&1  &&
# mpg123 $CANDY/startup_sounds/star_wars.mp3 > /dev/null 2>&1 &
# timeout 30s urxvt -name matrix -e cmatrix

