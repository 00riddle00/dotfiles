#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-07-16 11:44:27 EEST
# Path:   ~/.config/zsh/.zprofile
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# Start X if on tty1
if [[ -z $DISPLAY ]] && [[ $(tty) = /dev/tty1 ]]; then
  exec startx
fi
