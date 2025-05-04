# vim:tw=79:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2025-05-04 19:39:22 EEST
# Path:   ~/.config/zsh/.zshenv
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

exp() {
  builtin export ${1}="${2}"
}

setvar() {
  eval ${1}="\"${3}\""
}

# System directories
exp XDG_DATA_DIRS   '/usr/local/share:/usr/share'
exp XDG_CONFIG_DIRS '/etc/xdg'

# User directories
exp XDG_CACHE_HOME      "${HOME}/.cache"
exp XDG_CONFIG_HOME     "${HOME}/.config"
exp XDG_DATA_HOME       "${HOME}/.local/share"
exp XDG_STATE_HOME      "${HOME}/.local/state"
exp XDG_DESKTOP_DIR     "${HOME}/Desktop"
exp XDG_DOCUMENTS_DIR   "${HOME}/Documents"
exp XDG_DOWNLOAD_DIR    "${HOME}/Downloads"
exp XDG_MUSIC_DIR       "${HOME}/Music"
exp XDG_PICTURES_DIR    "${HOME}/Pictures"
exp XDG_PUBLICSHARE_DIR "${HOME}/Public"
exp XDG_TEMPLATES_DIR   "${HOME}/Templates"
exp XDG_VIDEOS_DIR      "${HOME}/Videos"

# Additional user directories
exp BIN         "${HOME}/.local/bin"
exp DOTSHARE    "${HOME}/.local/share/dotshare"
exp CANDY       "${DROPBOX}/candy"
exp DROPBOX     "${HOME}/Dropbox"
exp NOTES       "${DROPBOX}/gtd/"
exp PRO         "${HOME}/pro"
exp SCREENSHOTS "${HOME}/Screenshots"
exp MP          "${HOME}/tmp1"
exp MP1         "${HOME}/tmp1"
exp MP2         "${HOME}/tmp2"
exp MP3         "${HOME}/tmp3"
exp MP4         "${HOME}/tmp4"
exp MP5         "${HOME}/tmp5"
exp MP6         "${HOME}/tmp6"
exp MP7         "${HOME}/tmp7"
exp MP8         "${HOME}/tmp8"
exp MP0         "${HOME}/tmp8"

# XDG base directories
exp AUTOJUMP_ERROR_PATH         "${XDG_DATA_HOME}/autojump/errors.log"
exp AWS_CONFIG_FILE             "${XDG_CONFIG_HOME}/aws/config"
exp AWS_SHARED_CREDENTIALS_FILE "${XDG_CONFIG_HOME}/aws/credentials"
exp CARGO_HOME                  "${XDG_DATA_HOME}/cargo"
exp CGDB_DIR                    "${XDG_CONFIG_HOME}/cgdb"
exp CUDA_CACHE_PATH             "${XDG_CACHE_HOME}/nv"
exp DIRCOLORS                   "${XDG_CONFIG_HOME}/dircolors"
exp DOCKER_CONFIG               "${XDG_CONFIG_HOME}/docker"
exp DOTNET_CLI_HOME             "${XDG_DATA_HOME}/dotnet"
exp FEHBG_PATH                  "${XDG_DATA_HOME}/fehbg"
exp GDBHISTFILE                 "${XDG_DATA_HOME}/gdb/history"
exp GEM_HOME                    "$(gem env user_gemhome)"
exp GNUPGHOME                   "${XDG_DATA_HOME}/gnupg"
exp GOPATH                      "${XDG_DATA_HOME}/go"
exp GRADLE_USER_HOME            "${XDG_DATA_HOME}/gradle"
exp GTK2_RC_FILES               "${XDG_CONFIG_HOME}/gtk-2.0/gtkrc"
exp INPUTRC                     "${XDG_CONFIG_HOME}/readline/inputrc"
exp JUPYTER_PLATFORM_DIRS       '1'
exp LYNX_CFG                    "${XDG_CONFIG_HOME}/lynx/lynx.cfg"
exp NPM_CONFIG_USERCONFIG       "${XDG_CONFIG_HOME}/npm/npmrc"
exp PARALLEL_HOME               "${XDG_CONFIG_HOME}/parallel"
exp PERL_CPANM_HOME             "${XDG_CACHE_HOME}/cpanm"
exp PYTHONPYCACHEPREFIX         "${XDG_CACHE_HOME}/python"
exp PYTHONUSERBASE              "${XDG_DATA_HOME}/python"
exp PYTHON_HISTORY              "${XDG_STATE_HOME}/python/history"
exp RXVT_SOCKET                 "${XDG_RUNTIME_DIR}/urxvtd"
exp SQLITE_HISTORY              "${XDG_DATA_HOME}/sqlite_history"
exp SSH_AUTH_SOCK               "$(gpgconf --list-dirs agent-ssh-socket)"
exp TEXMFCONFIG                 "${XDG_CONFIG_HOME}/texlive/texmf-config"
exp TEXMFHOME                   "${XDG_DATA_HOME}/texmf"
exp TEXMFVAR                    "${XDG_CACHE_HOME}/texlive/texmf-var"
exp TMUX_PLUGIN_MANAGER_PATH    "${XDG_CONFIG_HOME}/tmux/plugins/"
exp W3M_DIR                     "${XDG_STATE_HOME}/w3m"
exp WAKATIME_HOME               "${XDG_CONFIG_HOME}/wakatime"
exp XAUTHORITY                  "${XDG_RUNTIME_DIR}/Xauthority"
exp XINITRC                     "${XDG_CONFIG_HOME}/X11/xinitrc"
exp ZDOTDIR                     "${ZDOTDIR:-$XDG_CONFIG_HOME/zsh}"
exp _JAVA_OPTIONS               "-Djava.util.prefs.userRoot=\"${XDG_CONFIG_HOME}/java\" -Djavafx.cachedir=\"${XDG_CACHE_HOME}/openjfx\""
# ^-- `export ZDOTDIR="${HOME}/.config/zsh"` is set in /etc/zsh/zshenv

# Default programs
exp BROWSER  'brave'
exp DIFFPROG 'nvim -d'
exp EDITOR   'nvim'
exp FILE     'ranger'
exp PAGER    'bat'
exp READER   'zathura'
exp TERMINAL 'urxvt'
exp VISUAL   'nvim'

# Locale
exp LC_ALL 'en_US.UTF-8'

# Default POSIX collation order
exp LC_COLLATE 'C'

# ISO date and time format for `ls`, `stat`.
exp TIME_STYLE 'long-iso'

# Uniform look for Qt and GTK applications
exp QT_QPA_PLATFORMTHEME 'gtk3'

# Customize sudo password prompt
exp SUDO_PROMPT $'\e[01;32msudo\e[m password: '

# ls color settings
# Use either '--color=tty' or '--color=never'
exp LS_COLOR        '--color=tty'
# Use either '--color=yes' or '--color=never'
exp LS_COLOR_ALWAYS '--color=yes'

# colorls color settings
# Use either '--color=auto' or '--color=never'
exp COLORLS_COLOR        '--color=auto'
# Use either '--color=always' or '--color=never'
exp COLORLS_COLOR_ALWAYS '--color=always'

# eza color settings
# Use either '--color=auto' or '--color=never'
exp EZA_COLOR        '--color=auto'
# Use either '--color=always' or '--color=never'
exp EZA_COLOR_ALWAYS '--color=always'

# eza icon settings
# Use either '--icons=always' or '--icons=never'
exp EZA_ICONS_ALWAYS '--icons=always'
# Any explicit use of the --icons=WHEN flag overrides this behavior:
exp EZA_ICONS_AUTO    true

# A more informative and visually appealing interface, leveraging colors and
# a detailed status column for better usability.
exp LESS '-MR --use-color -Dd+b$Dk+b$Du+C$DEWb$DNc$DPWb$DRWb$DSWb$DWWB'

# Use `bat` as a colorizing pager for man
exp MANPAGER   "sh -c 'col -bx | bat -l man -p'"
exp MANROFFOPT '-c'

# Customize the behavior of the pager (less) used by systemd.
exp SYSTEMD_LESS   "-FSXK ${LESS}"
# Always include colors, even when piped.
exp SYSTEMD_COLORS 1

# For GPG to prompt for passphrases by using the current terminal
exp GPG_TTY "$(tty)"

# Set the Subversion log/commit message editor to a custom script
exp SVN_EDITOR 'svn-editor-hook nvim'

# Zsh history
exp HISTFILE "${ZDOTDIR}/histfile"
exp HISTSIZE '400000'
exp SAVEHIST "$((HISTSIZE/2))"

# fzf, a command-line fuzzy finder
exp FZF_DEFAULT_OPTS " \
  --height 100% \
  --layout=reverse \
  --border \
"

# Monitor connections
exp DP1_SCREEN    'DP-0'
exp DP2_SCREEN    'DP-2'
exp DP3_SCREEN    'DP-4'
exp HDMI1_SCREEN  'HDMI-0'
exp LAPTOP_SCREEN 'eDP-1'

# Python
exp PYENV_ROOT "$XDG_DATA_HOME/pyenv"

# Perl
setvar PERL5_HOME          = "${HOME}/perl5"
setvar PERL5LIB            = "${PERL5_HOME}/lib/perl5${PERL5LIB:+:${PERL5LIB}}"
setvar PERL_LOCAL_LIB_ROOT = "${PERL5_HOME}${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"
setvar PERL_MB_OPT         = "--install_base \"${PERL5_HOME}\""
setvar PERL_MM_OPT         = "INSTALL_BASE=${PERL5_HOME}"

export PERL5_HOME
export PERL5LIB
export PERL_LOCAL_LIB_ROOT
export PERL_MB_OPT
export PERL_MM_OPT

# Path
typeset -U path

path=(
  ${HOME}/.local/bin
  ${HOME}/.local/bin/cron
  ${PYENV_ROOT}/bin
  ${PERL5_HOME}/bin
  ${GEM_HOME}/bin
  ${path}
)

export PATH

# Ensure that the systemd user instance has the same PATH value, so all
# services started by systemd will have access to binaries, scripts in ${PATH}.
systemctl --user import-environment PATH

unset -f exp
unset -f setvar
