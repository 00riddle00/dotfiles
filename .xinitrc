# Load X resources
[[ -f ~/.Xresources ]] && xrdb ~/.Xresources

# Remap keys with setxkbmap (if installed)
#
# if Alt + Shift is needed for something,
# use `grp:win_space_toggle` instead of `grp:alt_shift_toggle` 
#
if type setxkbmap >/dev/null 2>&1; then
    setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt  2>/dev/null
    setxkbmap -option caps:escape 2>/dev/null
fi

if [[ "$(hostname)" == "gecko" ]]; then
    # Use NVIDIA graphics only
    xrandr --setprovideroutputsource modesetting NVIDIA-0
    xrandr --auto
fi

# Configure multiple monitors
if [[ "$(hostname)" == "gecko" ]]; then
    $BIN/config-monitors-gecko
elif [[ "$(hostname)" == "tulkun" ]]; then
    $BIN/config-monitors-tulkun
fi

# Launch applications
xscreensaver -no-splash &
flameshot &
dropbox &
dunst &

# Spawn SSH Agent
eval $(ssh-agent -s)

# Launch a window manager (only one option should be uncommented)

# --------- openbox ---------
exec openbox-session
# ---------- i3-wm ----------
#exec i3
# ----------- dwm -----------
#feh --bg-scale "$DOTFILES/images/desktop/sea_color.jpg" &
#dwmblocks &
#dwm.loop
