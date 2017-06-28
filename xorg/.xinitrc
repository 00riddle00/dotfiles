#[[ -f ~/.Xresources ]] && xrdb -merge -I $HOME ~/.Xresources &&
exec openbox-session

#exec i3
#exec xmonad
