#!/usr/bin/env sh

# apps to be killed:
pkill -f conky 
pkill -f terminator
pkill -f urxvt 
pkill -f thunar 
pkill -f mpg123 
pkill -f tint2 

# change terminator config
sed -i 's/\bprofile = .*/profile = matrix/' $HOME/.config/terminator/config

# changes to gtk2 config
sed -i 's/.*gtk-theme-name.*/gtk-theme-name="Trinity"/' $HOME/.gtkrc-2.0
sed -i 's/.*gtk-icon-theme-name.*/gtk-icon-theme-name="ACYLS"/' $HOME/.gtkrc-2.0 
sed -i 's/.*gtk-cursor-theme-name.*/gtk-cursor-theme-name="Oxygen 14 Matrix Green"/' $HOME/.gtkrc-2.0 

# changes to gtk3 config
sed -i 's/.*gtk-theme-name.*/gtk-theme-name=Trinity/' $HOME/.dotfiles/.config/gtk-3.0/settings.ini 
sed -i 's/.*gtk-icon-theme-name.*/gtk-icon-theme-name=ACYLS/' $HOME/.dotfiles/.config/gtk-3.0/settings.ini 
sed -i 's/.*gtk-cursor-theme-name.*/gtk-cursor-theme-name=Oxygen 14 Matrix Green/' $HOME/.dotfiles/.config/gtk-3.0/settings.ini 

# change tint2 config
cp $HOME/.config/tint2/tint2rc.matrix $HOME/.config/tint2/tint2rc 

# change openbox autostart file
cp $SHELL_SCRIPTS_DIR/themes/matrix/autostart.sh $HOME/.config/openbox/autostart.sh 

# run openbox autostart
$HOME/.config/openbox/autostart.sh

