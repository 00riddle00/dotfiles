# ============================= 
#  user's environment variables
# ============================= 

export PATH="$PATH:$HOME/.local/bin/:$HOME/.local/bin/cron:$HOME/.local/bin/i3:$HOME/.local/bin/tint2:$HOME/.local/bin/dmenu:$HOME/.local/bin/mutt:$HOME/.local/bin/dwm:$HOME/.local/bin/openbox"

# Default programs:
export EDITOR="vim"
export TERMINAL="urxvt"
export BROWSER="brave"
export READER="zathura"
export STATUSBAR="i3blocks"
export PAGER="bat"
# bat used as a colorizing pager for man
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
## for i3
export FILE="ranger"

# XDG BASE DIR variables
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
# HOME dir clean-up (for XDG BASE DIR specs)
export XAUTHORITY="$XDG_RUNTIME_DIR/Xauthority" # This line will break some # DMs.
export ZDOTDIR="$HOME/.config/zsh"

export VIMCOLOR="miro8"
export VIMRC="$HOME/.vimrc"
export DIRCOLORS="$XDG_CONFIG_HOME/dircolors"

# Directories
export DOTFILES="$HOME/.dotfiles"
export BIN="$HOME/.local/bin"
export SHARE="$HOME/.local/share/riddle00"
export DOWNLOADS="$HOME/Downloads"
export DROPBOX="$HOME/Dropbox"
export SYNC="$DROPBOX/sync"
export TMP1="$HOME/tmp1"
export TMP2="$HOME/tmp2"
export TMP3="$HOME/tmp3"
export TMP4="$HOME/tmp4"
export PRO="$HOME/pro"
export CANDY="$SYNC/candy"
export NOTES="$SYNC/gtd/"
export KEEP="$SYNC/keepass"

# Screen
export HDMI_SCREEN="HDMI-1-1"
export LAPTOP_SCREEN="eDP-1-1"

# MAIN USER SETTINGS
export USER=riddle

# DOTFILES VARS
export VIMNOTES='$BIN/vimnotes.sh'
export LD_LIBRARY_PATH=$HOME/mylibs

# Fuzzy finder
export FZF_DEFAULT_OPTS="--height 100% --layout=reverse --border"

# CURRENT USER VARS
## there has been no need so far

# SYSTEMWIDE VARS
export LC_ALL='en_US.UTF-8'
# Uniform look for Qt and GTK applications
export QT_QPA_PLATFORMTHEME="gtk3"
