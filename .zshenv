# ============================= 
#  user's environment variables
# ============================= 

# Adds `~/.local/bin` to $PATH
export PATH="$PATH:$HOME/.local/bin/"

# point Zsh at the right dotfiles
ZDOTDIR="${ZDOTDIR:-$HOME/.zsh}"

# MAIN USER SETTINGS
export MAIN_USER=riddle
export MAIN_HOME=/home/$MAIN_USER
export DOTFILES_DIR=$MAIN_HOME/.dotfiles

# DOTFILES VARS
export VIMCOLOR=miro8
export DIRCOLORS=.dircolors
export SHELL_SCRIPTS_DIR=$DOTFILES_DIR/bin
export VIMNOTES='$SHELL_SCRIPTS_DIR/vimnotes.sh'
export LESSOPEN='|$DOTFILES_DIR/cmd/.lessfilter %s'
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
export HDMI_SCREEN=HDMI-1
export LAPTOP_SCREEN=eDP-1 
## for i3
export TERMINAL=urxvt
export FILE=ranger
export BROWSER=chrome

# CURRENT USER VARS
## there has been no need so far

# SYSTEMWIDE VARS
export LSCOLORS=ExFxCxDxBxegedabagacad
export LESS='-R'
export EDITOR=vim
export EDITOR_GUI=subl3
export LC_ALL='en_US.UTF-8'
# Uniform look for Qt and GTK applications
export QT_QPA_PLATFORMTHEME=gtk3
