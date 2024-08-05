#------------------------------------------------------------------------------
# User: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-06 00:56:01 EEST
# Path: ~/.config/zsh/functions_fzf.zsh
# URL:  https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# Copy using fzf
fcp() { cp -v "$1" "$(awk '{print $2}' ~/.config/directories | fzf | sed "s|~|$HOME|")" ; }

# Edit scripts (using fzf)
se() { du -a $BIN/* ~/.local/bin/* | awk '{print $2}' | fzf --preview 'bat --color always {}' | xargs -ro $EDITOR ; }

# -----------------------------------------------------------------------------
# File
# -----------------------------------------------------------------------------

# fe - open file with $EDITOR
fe() {
  local file
  file="$(
    /usr/bin/fd --type f --follow --exclude .git --max-depth=1 2> /dev/null \
      | fzf +m --preview "bat --color=always --style=numbers --line-range=:500 {}" --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' --preview-window=right:60%:wrap
  )" || return
  $EDITOR "$file" || return
}

# fea - including hidden files (only in current dir)
fea() {
  local file
  file="$(
    /usr/bin/fd --type f --hidden --follow --exclude .git --max-depth=1 2> /dev/null \
      | fzf +m --preview "bat --color=always --style=numbers --line-range=:500 {}" --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' --preview-window=right:60%:wrap
  )" || return
  $EDITOR "$file" || return
}

# fzf.vi - open files in ~/.viminfo
fzf.vi() {
  local files
  files="$(
    grep '^>' "$HOME/.viminfo" \
      | cut -c3- \
      | while read -r line; do
          [[ -f "${line/\~/$HOME}" ]] && echo "$line"
        done \
      | fzf -m -0 -1 -q "$*"
  )"
  "${EDITOR:-vim}" "${files/\~/$HOME}"
}

# -----------------------------------------------------------------------------
# Directory
# -----------------------------------------------------------------------------

# fd - cd to selected directory
fd() {
  local dir
  dir="$(
    find "${1:-.}" -path '*/\.*' -prune -o -type d -print 2> /dev/null \
      | fzf +m
  )" || return
  cd "$dir" || return
}

# fda - including hidden directories
fda() {
  local dir
  dir="$(
    find "${1:-.}" -type d 2> /dev/null \
      | fzf +m
  )" || return
  cd "$dir" || return
}

# -----------------------------------------------------------------------------
# History
# -----------------------------------------------------------------------------

# runcmd - utility function used to run the command in the shell
runcmd() {
  perl -e 'ioctl STDOUT, 0x5412, $_ for split //, <>'
}

# fh - repeat history
fh() {
  ([[ -n "$ZSH_NAME" ]] && fc -l 1 || history) \
    | fzf +s --tac \
    | sed -re 's/^\s*[0-9]+\s*//' \
    | runcmd
}

# writecmd - utility function used to write the command in the shell
writecmd() {
  perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do { chomp($_ = <>); $_ }'
}

# fhe - repeat history edit
fhe() {
  ([[ -n "$ZSH_NAME" ]] && fc -l 1 || history) \
    | fzf +s --tac \
    | sed -re 's/^\s*[0-9]+\s*//' \
    | writecmd
}

# -----------------------------------------------------------------------------
# PID
# -----------------------------------------------------------------------------

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

# -----------------------------------------------------------------------------
# Tmux
# -----------------------------------------------------------------------------

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

  if [[ "$current_window" -eq "$target_window" ]]; then
    tmux select-pane -t "$target_window.$target_pane"
  else
    tmux select-pane -t "$target_window.$target_pane" \
      && tmux select-window -t "$target_window"
  fi
}
