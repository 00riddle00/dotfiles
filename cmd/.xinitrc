[[ -f ~/.Xresources ]] && xrdb -merge -I$HOME ~/.Xresources &&
exec openbox-session

#exec xmonad
#exec i3
