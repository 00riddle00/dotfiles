# vim:tw=79:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-12 11:10:33 EEST
# Path:   ~/.config/zsh/.zprofile
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# Start X Window System if the current terminal (tty) is /dev/tty1
if [[ -z ${DISPLAY} ]] && [[ "$XDG_VTNR" -eq 1 ]]; then
  exec startx -- -keeptty > "$XDG_DATA_HOME/xorg/Xsession.log" 2>&1
fi
