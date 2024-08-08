#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-09 00:53:07 EEST
# Path:   ~/.config/zsh/fzf-functions.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# Copy files to a selected directory in $HOME.
# Usage:
#   $0 FILE1|DIR1 [FILE2|DIR2 ...]
cpf() {
    cp -rv "$@" \
        "$(\ls ~ \
            | fzf \
            | sed "s|^|$HOME/|")"
}

# Open a selected script in $BIN for editing.
# Usage:
#   $0
se() {
    du -a $BIN/* \
        | awk '{print $2}' \
        | fzf +m \
          --preview "bat \
              --color=always \
              --style=numbers \
              --line-range=:500 {}" \
          --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' \
          --preview-window=right:60%:nowrap \
        | xargs -r $EDITOR
}

# -----------------------
# File
# -----------------------

# TODO update / tidy up
# fe - open file with $EDITOR
fe() {
    local file
    file="$(
      /usr/bin/fd --type f --follow --exclude .git --max-depth=1 2> /dev/null \
          | fzf +m \
            --preview "bat \
                --color=always \
                --style=numbers \
                --line-range=:500 {}" \
            --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' \
            --preview-window=right:60%:nowrap
    )" || return
  $EDITOR "$file" || return
}

# TODO update / tidy up
# fea - including hidden files (only in current dir)
fea() {
  local file
  file="$(
    /usr/bin/fd --type f --hidden --follow --exclude .git --max-depth=1 2> /dev/null \
      | fzf +m \
        --preview "bat \
            --color=always \
            --style=numbers \
            --line-range=:500 {}"\
        --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' \
        --preview-window=right:60%:nowrap
  )" || return
  $EDITOR "$file" || return
}

# -----------------------
# Directory
# -----------------------

# TODO update / tidy up
# fd - cd to selected directory
fd() {
  local dir
  dir="$(
    find "${1:-.}" \
        -path '*/\.*' -prune \
        -o -type d    -print \
        2> /dev/null \
      | fzf +m
  )" || return
  cd "$dir" || return
}

# TODO update / tidy up
# fda - including hidden directories
fda() {
  local dir
  dir="$(
    find "${1:-.}" -type d 2> /dev/null \
      | fzf +m
  )" || return
  cd "$dir" || return
}

# -----------------------
# History
# -----------------------

# TODO update / tidy up
# runcmd - utility function used to run the command in the shell
runcmd() {
  perl -e 'ioctl STDOUT, 0x5412, $_ for split //, <>'
}

# TODO update / tidy up
# fh - repeat history
fh() {
  ([[ -n "$ZSH_NAME" ]] && fc -l 1 || history) \
    | fzf +s --tac \
    | sed -re 's/^\s*[0-9]+\s*//' \
    | runcmd
}

# TODO update / tidy up
# writecmd - utility function used to write the command in the shell
writecmd() {
  perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do { chomp($_ = <>); $_ }'
}

# TODO update / tidy up
# fhe - repeat history edit
fhe() {
  ([[ -n "$ZSH_NAME" ]] && fc -l 1 || history) \
    | fzf +s --tac \
    | sed -re 's/^\s*[0-9]+\s*//' \
    | writecmd
}

# -----------------------
# PID
# -----------------------

# TODO update / tidy up
# fkill - kill process
fkill() {
  local pid

  pid="$(
    ps -ef \
      | sed 1d \
      | fzf -m \
      | awk '{print $2}'
  )" || return

  kill -"${1:-9}" "$pid"
}

# -----------------------
# Tmux
# -----------------------

# TODO update / tidy up
# ftpane - switch pane (@george-b)
ftpane() {
  local panes
  local current_window
  local current_pane
  local target
  local target_window
  local target_pane

  panes="$(
    tmux list-panes \
      -s \
      -F '#I:#P - #{pane_current_path} #{pane_current_command}'
  )"
  current_pane="$(tmux display-message -p '#I:#P')"
  current_window="$(tmux display-message -p '#I')"

  target="$(
    echo "$panes" \
      | grep -v "$current_pane" \
      | fzf +m --reverse
  )" || return

  target_window="$(
    echo "$target" \
      | awk 'BEGIN{FS=":|-"} {print$1}'
  )"

  target_pane="$(
    echo "$target" \
      | awk 'BEGIN{FS=":|-"} {print$2}' \
      | cut -c 1
  )"

  if [[ "$current_window" -eq "$target_window" ]] ; then
    tmux select-pane -t "$target_window.$target_pane"
  else
    tmux select-pane -t "$target_window.$target_pane" \
      && tmux select-window -t "$target_window"
  fi
}
