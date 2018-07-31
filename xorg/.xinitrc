#[openbox]
exec openbox-session
[[ -f ~/.Xresources ]] && xrdb -merge -I $HOME ~/.Xresources

#[dwm]

## Statusbar loop
#while true; do
   #xsetroot -name "$( date +"%F %R" )"
   #sleep 1m    # Update time every minute
#done &

## Autostart section
#pcmanfm &

#exec dwm


