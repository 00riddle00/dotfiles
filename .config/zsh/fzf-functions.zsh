# vim: set ft=zsh tw=88 nu ai et ts=2 sw=2:
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-09 04:17:10 CEST
# Path:   ~/.config/zsh/fzf-functions.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# --------------------------------------------
# Edit files
# --------------------------------------------

#* Open a file in the current directory for editing.
#* USAGE:
#*   ${0} [--hidden]
#**
edit-file() {
  local include_hidden=""
  local file

  if [[ $1 == "--hidden" ]]; then
    include_hidden="--hidden"
  fi

  file="$(
    /usr/bin/fd \
      --type f \
      $include_hidden \
      --follow \
      --exclude .git \
      --max-depth=1 \
      2> /dev/null \
      | fzf +m \
        --preview "bat \
          --color=always \
          --style=numbers \
          --line-range=:500 {}" \
        --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' \
        --preview-window=right:60%:nowrap
  )" || return
  "${EDITOR}" "${file}" || return
}

#* Open a selected script in ${BIN} for editing.
#* USAGE:
#*   ${0}
#**
se() {
  du -a "${BIN}"/* \
    | awk '{print $2}' \
    | sed "s|^${BIN}/||" \
    | fzf +m \
      --preview "bat \
        --color=always \
        --style=numbers \
        --line-range=:500 \
          ${BIN}/{}" \
      --bind 'ctrl-u:preview-page-up,ctrl-d:preview-page-down' \
      --preview-window=right:60%:nowrap \
    | command xargs -I {} -r "${EDITOR}" "${BIN}/{}"
}

# --------------------------------------------
# Misc
# --------------------------------------------

#* Copy files to a selected directory in ${HOME}.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#**
cpf() {
  cp -rv "${@}" \
    "$(command ls ~ \
      | fzf \
      | sed "s|^|${HOME}/|")"
}

# cd to a selected directory
#* USAGE:
#*   ${0} [--hidden] [DIRECTORY]
#**
fdd() {
  local include_hidden=false
  local dir_

  if [[ $1 == "--hidden" ]]; then
    include_hidden=true
    shift
  fi

  if $include_hidden; then
    dir_="$(fd -H -t d . "${1:-.}" | fzf +m)" || return
  else
    dir_="$(fd -t d . "${1:-.}" | fzf +m)" || return
  fi

  builtin cd "${dir_}" || return
}

# Interactively select a process to kill
#* USAGE:
#*   ${0} [signal]
#**
fkill() {
  local pid
  local signal="${1:-9}"

  pid="$(
    ps -eo pid,ppid,user,%cpu,%mem,etime,cmd \
      | sed 1d \
      | fzf -m --header='Select a process to kill' \
      | awk '{print $1}'
  )" || return

  if kill -"$signal" "${pid}"; then
    echo "Killed PID ${pid} with signal $signal"
  fi
}

# Switch pane in tmux
# ^---- Kudos to @george-b
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
    echo "${panes}" \
      | command rg -v "${current_pane}" \
      | fzf +m --reverse
  )" || return

  target_window="$(
    echo "${target}" \
      | awk 'BEGIN{FS=":|-"} {print $1}'
  )"

  target_pane="$(
    echo "$target" \
      | awk 'BEGIN{FS=":|-"} {print $2}' \
      | cut -c 1
  )"

  if [[ ${current_window} -eq ${target_window} ]]; then
    tmux select-pane -t "${target_window}.${target_pane}"
  else
    tmux select-pane -t "${target_window}.${target_pane}" \
      && tmux select-window -t "${target_window}"
  fi
}
