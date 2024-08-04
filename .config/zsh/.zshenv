#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-04 18:52:11 EEST
# Path:   ~/.config/zsh/.zshenv
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# System directories
export XDG_DATA_DIRS="/usr/local/share:/usr/share"
export XDG_CONFIG_DIRS="/etc/xdg"

# User directories
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"
export XDG_DESKTOP_DIR="$HOME/Desktop"
export XDG_DOCUMENTS_DIR="$HOME/Documents"
export XDG_DOWNLOAD_DIR="$HOME/Downloads"
export XDG_MUSIC_DIR="$HOME/Music"
export XDG_PICTURES_DIR="$HOME/Pictures"
export XDG_PUBLICSHARE_DIR="$HOME/Public"
export XDG_TEMPLATES_DIR="$HOME/Templates"
export XDG_VIDEOS_DIR="$HOME/Videos"

# Additional user directories
export BIN="$HOME/.local/bin"
export DOTSHARE="$HOME/.local/share/dotshare"
export CANDY="$DROPBOX/candy"
export DROPBOX="$HOME/Dropbox"
export NOTES="$DROPBOX/gtd/"
export PRO="$HOME/pro"
export SCREENSHOTS="$HOME/Screenshots"
export MP1="$HOME/tmp1"
export MP2="$HOME/tmp2"
export MP3="$HOME/tmp3"
export MP4="$HOME/tmp4"
export MP5="$HOME/tmp5"
export MP6="$HOME/tmp6"
export MP7="$HOME/tmp7"
export MP8="$HOME/tmp8"

# XDG base directories
export AUTOJUMP_ERROR_PATH="$XDG_DATA_HOME/autojump/errors.log"
export CARGO_HOME="$XDG_DATA_HOME/cargo"
export CUDA_CACHE_PATH="$XDG_CACHE_HOME/nv"
export DIRCOLORS="$XDG_CONFIG_HOME/dircolors"
export DOCKER_CONFIG="$XDG_CONFIG_HOME/docker"
export FEHBG_PATH="$XDG_DATA_HOME/fehbg"
export GEM_HOME="$(gem env user_gemhome)"
export GNUPGHOME="$XDG_DATA_HOME/gnupg"
export GOPATH="$XDG_DATA_HOME/go"
export GRADLE_USER_HOME="$XDG_DATA_HOME/gradle"
export GTK2_RC_FILES="$XDG_CONFIG_HOME/gtk-2.0/gtkrc"
export INPUTRC="$XDG_CONFIG_HOME/readline/inputrc"
export JUPYTER_PLATFORM_DIRS="1"
export LYNX_CFG="$XDG_CONFIG_HOME/lynx/lynx.cfg"
export NPM_CONFIG_USERCONFIG="$XDG_CONFIG_HOME/npm/npmrc"
export PARALLEL_HOME="$XDG_CONFIG_HOME/parallel"
export PYTHONPYCACHEPREFIX="$XDG_CACHE_HOME/python"
export PYTHONUSERBASE="$XDG_DATA_HOME/python"
export PYTHON_HISTORY="$XDG_STATE_HOME/python/history"
export RXVT_SOCKET="$XDG_RUNTIME_DIR/urxvtd"
export SQLITE_HISTORY="$XDG_DATA_HOME/sqlite_history"
export SSH_AUTH_SOCK="$(gpgconf --list-dirs agent-ssh-socket)"
export TEXMFCONFIG="$XDG_CONFIG_HOME/texlive/texmf-config"
export TEXMFHOME="$XDG_DATA_HOME/texmf"
export TEXMFVAR="$XDG_CACHE_HOME/texlive/texmf-var"
export TMUX_PLUGIN_MANAGER_PATH="$XDG_CONFIG_HOME/tmux/plugins/"
export W3M_DIR="$XDG_STATE_HOME/w3m"
export XAUTHORITY="$XDG_RUNTIME_DIR/Xauthority"
#export XINITRC="$XDG_CONFIG_HOME/X11/xinit/xinitrc"
export XINITRC="$XDG_CONFIG_HOME/X11/xinitrc"
export _JAVA_OPTIONS=-Djava.util.prefs.userRoot="$XDG_CONFIG_HOME/java"
export ZDOTDIR="${ZDOTDIR:-$XDG_CONFIG_HOME/zsh}"
# ^-- `export ZDOTDIR="$HOME/.config/zsh"` is set in /etc/zsh/zshenv"

# Default programs
export BROWSER="brave"
export DIFFPROG="nvim -d"
export EDITOR="nvim"
export FILE="ranger"
export PAGER="bat"
export READER="zathura"
export TERMINAL="urxvt"
export VISUAL="nvim"

# Locale
export LC_ALL="en_US.UTF-8"

# Default POSIX collation order
export LC_COLLATE="C"

# Inform applications that terminal emulator supports True Color
export COLORTERM=truecolor

# Uniform look for Qt and GTK applications
export QT_QPA_PLATFORMTHEME="gtk3"

# Customize sudo password prompt
export SUDO_PROMPT=$'\e[01;32msudo\e[m password: '

# A more informative and visually appealing interface, leveraging colors and 
# a detailed status column for better usability.
export LESS='-MR --use-color -Dd+b$Dk+b$Du+C$DEWb$DNc$DPWb$DRWb$DSWb$DWWB'

# Use `bat` as a colorizing pager for man
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
export MANROFFOPT="-c"

# Customize the behavior of the pager (less) used by systemd.
export SYSTEMD_LESS="-FSXK $LESS"

# For GPG to prompt for passphrases by using the current terminal
export GPG_TTY="$(tty)"

# Zsh history
export HISTFILE="$ZDOTDIR/histfile"
export HISTSIZE=400000
export SAVEHIST=$((HISTSIZE/2))

# fzf, a command-line fuzzy finder
export FZF_DEFAULT_OPTS=" \
  --height 100% \
  --layout=reverse \
  --border \
"

# Monitor connections
export DP1_SCREEN="DP-0"
export DP2_SCREEN="DP-2"
export DP3_SCREEN="DP-4"
export HDMI1_SCREEN="HDMI-0"
export LAPTOP_SCREEN="eDP-1"

# Perl
PERL5_HOME="$HOME/perl5"
PERL5LIB="${PERL5_HOME}/lib/perl5${PERL5LIB:+:${PERL5LIB}}"
PERL_LOCAL_LIB_ROOT="${PERL5_HOME}${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"
PERL_MB_OPT="--install_base \"${PERL5_HOME}\""
PERL_MM_OPT="INSTALL_BASE=$HOME/perl5"

export PERL5_HOME
export PERL5LIB
export PERL_LOCAL_LIB_ROOT
export PERL_MB_OPT
export PERL_MM_OPT

# Path
typeset -U path

path=(
  $HOME/.local/bin
  $HOME/.local/bin/cron
  $PERL5_HOME/bin
  $GEM_HOME/bin
  $path
)

export PATH

# Ensure that the systemd user instance has the same PATH value, so all
# services started by systemd will have access to binaries, scripts in $PATH.
systemctl --user import-environment PATH
