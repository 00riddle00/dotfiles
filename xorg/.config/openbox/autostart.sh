#! /bin/sh

# xrandr --output eDP-0 --off

# HDMI left eDP left VGA
# xrandr --output VGA-0 --auto --output eDP-0  --auto left-of VGA-0 --output HDMI-0 --auto --left-of eDP-0

# HDMI left VGA
# xrandr --output VGA-0 --auto --output HDMI-0 --auto --left-of VGA-0


# HDMI left VGA 90
# xrandr --output VGA-0 --auto --rotate left --output HDMI-0 --auto --left-of VGA-0


# HDMI left eDP  (HOME)
xrandr --output HDMI-1 --auto --output eDP-1 --auto --right-of HDMI-1

# OSOS 2 screens atomik
# xrandr --output HDMI-1 --auto --output DVI-D-1 --auto --right-of HDMI-1

 # VGA left eDP (Home)
# xrandr --output VGA-1 --auto --output eDP-1 --auto --right-of VGA-1

#xrandr --output VGA-0 --auto --rotate left --output eDP-0 --auto --right-of VGA-0

# book
 #xrandr --output HDMI-1 --auto --rotate left --output eDP-1 --auto --right-of HDMI-1

#autokey-gtk &
gnome-screensaver &
feh --bg-scale $CANDY/wallpapers/black_arch.jpg &
conky -c $DOTFILES_DIR/xorg/.conky/archconky &
