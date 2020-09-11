# ============================= 
#  user's environment variables
# ============================= 

# Adds `~/.local/bin` to $PATH
export PATH="$PATH:$HOME/.local/bin/:$HOME/.local/bin/cron:$HOME/.local/bin/i3:$HOME/.local/bin/tint2:$HOME/.local/bin/dmenu:$HOME/.local/bin/mutt:$HOME/.local/bin/dwm:$HOME/.local/bin/openbox"

# Fuzzy finder
export FZF_DEFAULT_OPTS="--height 100% --layout=reverse --border"

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

# XDG BASE DIR variables
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
# HOME dir clean-up (for XDG BASE DIR specs)
export XAUTHORITY="$XDG_RUNTIME_DIR/Xauthority" # This line will break some # DMs.
export ZDOTDIR="$HOME/.config/zsh"

# MAIN USER SETTINGS
export USER=riddle
export HOME=/home/$USER
export DOTFILES=$HOME/.dotfiles

# DOTFILES VARS
export VIMCOLOR=miro8
export DIRCOLORS=$XDG_CONFIG_HOME/dircolors
export BIN=$HOME/.local/bin
export SHARE=$HOME/.local/share/riddle00
export VIMNOTES='$BIN/vimnotes.sh'
export LD_LIBRARY_PATH=$HOME/mylibs

# MAIN USER VARS
export VIMRC=$HOME/.vimrc
export DOWNLOADS=$HOME/Downloads
export DW=$HOME/Downloads
export DROPBOX=$HOME/Dropbox
export TMP1=$HOME/tmp1
export TMP2=$HOME/tmp2
export TMP3=$HOME/tmp3
export TMP4=$HOME/tmp4
export PRO=$HOME/pro
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
