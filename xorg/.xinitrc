#[openbox]
[[ -f ~/.Xresources ]] && xrdb ~/.Xresources

## remap keys with setxkbmap (if installed)
if type setxkbmap >/dev/null 2>&1; then
    setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt  2>/dev/null
    setxkbmap -option caps:escape 2>/dev/null
fi

exec openbox-session

