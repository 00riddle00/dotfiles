#!/usr/bin/env sh

# apps to be killed:
pkill -f conky  
pkill -f terminator 
pkill -f urxvt 
pkill -f thunar 
pkill -f mpg123 
pkill -f tint2 

# change terminator config
sed -i 's/\bprofile = .*/profile = solarized-dark/' $HOME/.config/terminator/config 

# changes to gtk2 config
sed -i 's/.*gtk-theme-name.*/gtk-theme-name="Numix-Archblue"/' $HOME/.gtkrc-2.0 &
sed -i 's/.*gtk-icon-theme-name.*/gtk-icon-theme-name="la-capitaine"/' $HOME/.gtkrc-2.0 &
sed -i 's/.*gtk-cursor-theme-name.*/gtk-cursor-theme-name="Numix-Cursor-Light"/' $HOME/.gtkrc-2.0 

# changes to gtk3 config
sed -i 's/.*gtk-theme-name.*/gtk-theme-name=Numix-Archblue/' $HOME/.dotfiles/.config/gtk-3.0/settings.ini &
sed -i 's/.*gtk-icon-theme-name.*/gtk-icon-theme-name=la-capitaine/' $HOME/.dotfiles/.config/gtk-3.0/settings.ini &
sed -i 's/.*gtk-cursor-theme-name.*/gtk-cursor-theme-name=Numix-Cursor-Light/' $HOME/.dotfiles/.config/gtk-3.0/settings.ini 

# change tint2 config
cp $HOME/.config/tint2/tint2rc.riddle $HOME/.config/tint2/tint2rc 

# change openbox autostart file
cp $SHELL_SCRIPTS_DIR/themes/riddle/autostart.sh $HOME/.config/openbox/autostart.sh 

# run openbox autostart
$HOME/.config/openbox/autostart.sh
