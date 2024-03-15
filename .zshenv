# ============================= 
#  user's environment variables
# ============================= 

typeset -U path

path=(
    $HOME/bin
    $HOME/bin/scripts
    $HOME/.local/bin
    $HOME/.local/bin/cron
    $HOME/.emacs.d/bin
    $HOME/perl5/bin
    $path)

export PATH

PERL5LIB="$HOME/perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}"
PERL_LOCAL_LIB_ROOT="$HOME/perl5${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"
PERL_MB_OPT="--install_base \"$HOME/perl5\""
PERL_MM_OPT="INSTALL_BASE=$HOME/perl5"

export PERL5LIB
export PERL_LOCAL_LIB_ROOT
export PERL_MB_OPT
export PERL_MM_OPT

# XDG BASE DIR variables
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

# HOME dir clean-up (for XDG BASE DIR specs)
export XAUTHORITY="$XDG_RUNTIME_DIR/Xauthority" # This line will break some # DMs.
export ZDOTDIR="$HOME/.config/zsh"
export GTK2_RC_FILES="$XDG_CONFIG_HOME"/gtk-2.0/gtkrc
export INPUTRC="$XDG_CONFIG_HOME"/readline/inputrc
export XINITRC="$XDG_CONFIG_HOME"/X11/xinitrc
export FEHBG_PATH="$XDG_DATA_HOME"/fehbg
export GRADLE_USER_HOME="$XDG_DATA_HOME"/gradle
export _JAVA_OPTIONS=-Djava.util.prefs.userRoot="$XDG_CONFIG_HOME"/java
export _JAVA_OPTIONS=-Djavafx.cachedir="$XDG_CACHE_HOME"/openjfx
export TEXMFHOME=$XDG_DATA_HOME/texmf
export TEXMFVAR=$XDG_CACHE_HOME/texlive/texmf-var
export TEXMFCONFIG=$XDG_CONFIG_HOME/texlive/texmf-config
export LYNX_CFG_PATH="$XDG_CONFIG_HOME"/lynx.cfg
export DIRCOLORS="$XDG_CONFIG_HOME/dircolors"

# Editor
if [ -x "$(command -v nvim)" ];
then 
    export EDITOR="nvim"
    export VISUAL="nvim"
    export VIMRC="$XDG_CONFIG_HOME/nvim/init.vim"
else
    export EDITOR="vim"
    export VISUAL="vim"
    export VIMRC="$XDG_CONFIG_HOME/vim/vimrc"
    export VIMINIT="set nocp | source ${XDG_CONFIG_HOME}/vim/vimrc"
fi
export VIMCOLOR="miro8"

# Default programs
export CC="gcc"
export TERMINAL="urxvt"
export BROWSER="brave"
export READER="zathura"
export STATUSBAR="i3blocks"
export PAGER="less"
# bat used as a colorizing pager for man
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
export BAT_PAGER="less -RF"
#   It might also be necessary to set MANROFFOPT="-c"
#   if you experience formatting problems (I do).
export MANROFFOPT="-c"
## for i3
export FILE="ranger"

# Directories
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

# Screen
export DP_SCREEN="DP-0"
export DP1_SCREEN="DP-0"
export DP2_SCREEN="DP-2"
export DP3_SCREEN="DP-4"
export HDMI_SCREEN="HDMI-0"
export LAPTOP_SCREEN="eDP-1"

# Fuzzy finder
export FZF_DEFAULT_OPTS="--height 100% --layout=reverse --border"

# Uniform look for Qt and GTK applications
export QT_QPA_PLATFORMTHEME="gtk3"

# SYSTEMWIDE VARS
export LC_ALL='en_US.UTF-8'
export SUDO_ASKPASS="$BIN/dmenu-pass"

# Java
export JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF8"
export CLASSPATH="$CLASSPATH:/usr/share/weka/weka.jar"
# Fixes misbehaving Java applications in dwm
export _JAVA_AWT_WM_NONREPARENTING=1
