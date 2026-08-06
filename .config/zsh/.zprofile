# vim:tw=79:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-06 21:17:02 CEST
# Path:   ~/.config/zsh/.zprofile
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

if [ -z "${SSH_AUTH_SOCK}" ]; then
  eval "$(ssh-agent -s)"
fi

# Start X Window System if the current terminal (tty) is /dev/tty1
if [[ -z ${DISPLAY} ]] && [[ "$XDG_VTNR" -eq 1 ]]; then
  exec startx -- -keeptty > "$XDG_DATA_HOME/xorg/Xsession.log" 2>&1
fi
