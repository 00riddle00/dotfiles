# ============================= 
#  user's environment variables
# ============================= 

# Adds `~/.local/bin` to $PATH
export PATH="$PATH:$HOME/.local/bin/:$HOME/.local/bin/cron:$HOME/.local/bin/i3:$HOME/.local/bin/tint2:$HOME/.local/bin/dmenu"

# Default programs:
export EDITOR="vim"
export TERMINAL="urxvt"
export BROWSER="brave"
export READER="zathura"
export STATUSBAR="i3blocks"
export PAGER='bat'
# bat used as a colorizing pager for man
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
## for i3
export FILE=ranger

# ~/ Clean-up:
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XAUTHORITY="$XDG_RUNTIME_DIR/Xauthority" # This line will break some DMs.
export ZDOTDIR="$HOME/.config/zsh"

# MAIN USER SETTINGS
export MAIN_USER=riddle
export MAIN_HOME=/home/$MAIN_USER
export DOTFILES_DIR=$MAIN_HOME/.dotfiles

# DOTFILES VARS
export VIMCOLOR=miro8
export DIRCOLORS=$XDG_CONFIG_HOME/dircolors
export SHELL_SCRIPTS_DIR=$DOTFILES_DIR/bin
export SHARE=$HOME/.local/bin/share
export VIMNOTES='$SHELL_SCRIPTS_DIR/vimnotes.sh'
export LD_LIBRARY_PATH=$MAIN_HOME/mylibs
export ZSH_DIR=$MAIN_HOME/.zsh

# MAIN USER VARS
export VIMRC=$MAIN_HOME/.vimrc
export DOWNLOADS=$MAIN_HOME/Downloads
export DW=$MAIN_HOME/Downloads
export DROPBOX=$MAIN_HOME/Dropbox
export TMP1=$MAIN_HOME/tmp1
export TMP2=$MAIN_HOME/tmp2
export TMP3=$MAIN_HOME/tmp3
export TMP4=$MAIN_HOME/tmp4
export PRO=$MAIN_HOME/pro
export SYNC=$DROPBOX/sync
export CANDY=$SYNC/candy
export NOTES=$SYNC/gtd/
export KEEP=$SYNC/keepass
export HDMI_SCREEN=HDMI-1-1
export LAPTOP_SCREEN=eDP-1-1

# CURRENT USER VARS
## there has been no need so far

# SYSTEMWIDE VARS
export LC_ALL='en_US.UTF-8'
# Uniform look for Qt and GTK applications
export QT_QPA_PLATFORMTHEME=gtk3
