[[ -f ~/.Xresources ]] && xrdb ~/.Xresources

# remap keys with setxkbmap (if installed)
if type setxkbmap >/dev/null 2>&1; then
    setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt  2>/dev/null
    setxkbmap -option caps:escape 2>/dev/null
fi

# temp workaround for Razer mouse
xinput set-prop "pointer:Razer Razer Naga Trinity" "libinput Accel Speed" -0.8

# Use NVIDIA graphics only
xrandr --setprovideroutputsource modesetting NVIDIA-0
xrandr --auto

# launch apps
$SHELL_SCRIPTS_DIR/config_monitors.sh
xscreensaver -no-splash &
flameshot &
dropbox &
dunst &
safeeyes &

# launch wm

## exec xmonad

exec i3

# xsetroot -name "Thanks for all the fish!" &
# dwm.loop

