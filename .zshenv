# ============================= 
#  user's environment variables
# ============================= 

export PATH="$PATH:$HOME/.local/bin/:$HOME/.local/bin/cron:$HOME/.local/bin/sg_scripts"

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

# Default programs
export CC="gcc"
export EDITOR="vim"
export TERMINAL="urxvt"
export BROWSER="brave"
export READER="zathura"
export STATUSBAR="i3blocks"
export PAGER="less"
# bat used as a colorizing pager for man
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
export BAT_PAGER="less -RF"
## for i3
export FILE="ranger"

# Directories
export DOTFILES="$HOME/.dotfiles"
export BIN="$HOME/.local/bin"
export DOTSHARE="$HOME/.local/share/dotshare"
export DOWNLOADS="$HOME/Downloads"
export DROPBOX="$HOME/Dropbox"
export SYNC="$HOME/Dropbox"
export TMP1="$HOME/tmp1"
export TMP2="$HOME/tmp2"
export TMP3="$HOME/tmp3"
export TMP4="$HOME/tmp4"
export PRO="$HOME/pro"
export CANDY="$DROPBOX/candy"
export NOTES="$DROPBOX/gtd/"
export KEEP="$DROPBOX/keepass"

# Screen
export HDMI_SCREEN="HDMI-1-1"
export LAPTOP_SCREEN="eDP-1-1"

# Fuzzy finder
export FZF_DEFAULT_OPTS="--height 100% --layout=reverse --border"

# Uniform look for Qt and GTK applications
export QT_QPA_PLATFORMTHEME="gtk3"

# SYSTEMWIDE VARS
export LC_ALL='en_US.UTF-8'
export SUDO_ASKPASS="$BIN/dmenu-pass"

# Java
export JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF8"
# Fixes misbehaving Java applications in dwm
export _JAVA_AWT_WM_NONREPARENTING=1
