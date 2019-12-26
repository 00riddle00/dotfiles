#! /bin/sh

export HDMI_SCREEN=HDMI-1-1
export LAPTOP_SCREEN=eDP-1-1

## check if X is running
if xset q &>/dev/null; then

    ## Configure display
    ## if HDMI display connected, use it. Else use eDP.
    xrandr | awk '/ connected/{print $1}' | grep $HDMI_SCREEN > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        xrandr --output $HDMI_SCREEN --auto
        :
    else
        xrandr --output $LAPTOP_SCREEN --auto
    fi;
fi;

feh  --bg-scale "$MAIN_HOME/Dropbox/sync/candy/wallpapers/arch5.jpg" && 
conky -c $DOTFILES_DIR/xorg/.conky/stats_blue > /dev/null 2>&1 &
conky -c $DOTFILES_DIR/xorg/.conky/clock_blue_full > /dev/null 2>&1 &
# espeak "Welcome home, Riddle!" > /dev/null 2>&1  &&
# mpg123 $CANDY/startup_sounds/star_wars.mp3 > /dev/null 2>&1 &
tint2 &
# timeout 30s urxvt -name matrix -e cmatrix
urxvt -name t2

