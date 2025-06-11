# vim:tw=79:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-12 11:10:33 EEST
# Path:   ~/.config/zsh/.zprofile
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s)"
fi

# Start X Window / Wayland System if the current terminal (tty) is /dev/tty1
if [[ -z ${DISPLAY} ]] && [[ "$XDG_VTNR" -eq 1 ]]; then
  exec startx -- -keeptty > "$XDG_DATA_HOME/xorg/Xsession.log" 2>&1
  #mkdir -p "$XDG_DATA_HOME/labwc" && exec labwc > "$XDG_DATA_HOME/labwc/labwc_session.log" 2>&1
  #exec Hyprland > ${XDG_DATA_HOME}/hyprland/hyprland_session.log 2>&1
  #exec sway --unsupported-gpu
  # ^-- Logs to ${XDG_DATA_HOME}/sway/sway_session.log
fi
