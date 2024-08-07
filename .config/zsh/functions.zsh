#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-08 00:35:53 EEST
# Path:   ~/.config/zsh/functions.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# --------------------------------------------
# Aliases
# --------------------------------------------

# Create a Zsh alias
# Usage e.g.:
#     ma "vedit" "vim $(readlink -f file_to_edit.txt)"
#     ma "cdhere" "cd $(pwd)"
ma() { 
    echo alias "$1  '$2'" >> "$ZDOTDIR/aliases.zsh"
    echo "*** Alias added ***"
    echo "alias $1  '$2'"
    source "$ZDOTDIR/.zshrc"
}

# Create a Zsh alias to cd into current directory
# Usage e.g.:
#   macd "cdhere"
macd() { 
    echo alias "$1='cd $(pwd)'" >> "$ZDOTDIR/aliases.zsh"
    echo "*** Alias added ***
    alias $1='cd $(pwd)'"
    source "$ZDOTDIR/.zshrc"
}

# --------------------------------------------
# Backups
# --------------------------------------------

# Make a backup in the current directory
# Usage:
#   bk FILE1|DIR1 [FILE2|DIR2] ...
bk() {
    for item in "$@"; do
        cp -r "$item" "$item.bak"
    done
}

# Make a backup both in local disk and remote location
# Usage:
#   kk FILE1|DIR1 [FILE2|DIR2] ...
function kk() {
    for item in "$@"; do
        cp -rv "$item" "${HOME}/backups/${item}.$(date +%F_%R_%S).bak"
        cp -rv "$item" "${DROPBOX}/backup/${item}.$(date +%F_%R_%S).bak"
    done
}

# --------------------------------------------
# Find
# --------------------------------------------

# List all file extensions in the current directory (recursively)
# Usage:
#   ext
ext() { 
    find . -type f \
        | perl -ne 'print $1 if m/\.([^.\/]+)$/' \
        | sort -u
}

# TODO update / tidy up
# Searches hidden files as well
find.file() {
    find . -iname "*${1}*" | sort -u
}

# TODO update / tidy up
# Does not search hidden files
find.file.abs() {
    readlink -f **/** | grep -i "${1}" | sort -u
}

# TODO update / tidy up
# Find different file extensions, exluding ./.git, ./venv and ./.idea dirs.
files-ext() {
    find . \
        -path    ./.git \
        -o -path ./venv  -prune \
        -o -path ./.idea -prune \
        -o -type f \
            | sed -rn 's|.*/[^/]+\.([^/.]+)$|\1|p' \
            | sort -u
}

# --------------------------------------------
# Set operations on files (linewise)
# --------------------------------------------

# A U B (union of lines, without duplicates)
# Usage:
#   a_union_b FILE1 FILE2
a_union_b() { cat "$1" "$2" | sort -u }

# A & B (intersection of lines)
# Usage:
#   a_and_b FILE1 FILE2
a_and_b() { comm -12 <( sort "$1" ) <( sort "$2" ) }

# Get all lines from A which contain a string from B
# Usage:
#   a_and_string_in_b FILE1 FILE2
a_and_string_in_b() { grep -F -f "$2" "$1" | sort }

# A \ B (subtract lines from A which appear in B)
# Usage:
#   a_minus_b FILE1 FILE2
a_minus_b() { grep -Fvx -f "$2" "$1" | sort }

# Remove lines from A which contain a string from B
# Usage:
#   a_minus_string_in_b FILE1 FILE2
a_minus_string_in_b() { grep -Fv -f "$2" "$1" | sort }

# --------------------------------------------
# Structured data files
# --------------------------------------------

# Summary of the number of fields in each line of a TSV file
# Usage:
#   fields FILE
fields () {
    awk -F"\t" '{print NF}' "$1" | uniq -c
}

# Summary of the number of fields in each line of a CSV file
# Usage:
#   fields-csv FILE
fields-csv () {
    awk -F, '{print NF}' "$1" | uniq -c
}

# TODO update / tidy up
# Usage: cols <col_no> <file>
# $1 - col no
# $2 - file name
cols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort | uniq
}

# TODO update / tidy up
# Usage: cols <col_no> <file>
# $1 - col no
# $2 - file name
colss () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort
}

# TODO update / tidy up
# Usage: cols <col_no> <file>
cols-csv () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F, -f <(echo "$col_no") "$2" | sort | uniq
}

# TODO update / tidy up
# Usage: cols <col_no> <file>
ncols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort -n | uniq
}

# TODO update / tidy up
# Usage: pcols <col_no> <file>
pcols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" \
        | perl -e '@data = map {[split(/\t/,$_)]} <>; \
            print map {join("\t",@$_)} sort {$a->[0] <=> $b->[0]} @data' \
        | uniq
}

# --------------------------------------------
# Timestamps
# --------------------------------------------

# TODO update / tidy up
# Convert epoch to human-readable date
# Usage: epoch-to-date 1643234400
# Output: 2022-01-27
epoch-to-date() {
    date  -d @"$1" "+%F"
}

# TODO update / tidy up
# Convert epoch to human-readable date
# Usage: date-to-epoch 2022-01-27
# Output: 1643234400
date-to-epoch() {
    date  -d "$1" "+%s"
}

# --------------------------------------------
# Misc
# --------------------------------------------

# Go to a command's flag description in its manpage
# Usage e.g.:
#   manf grep -r
manf () { man "$1" | less -p "^ +$2"; }

# Edit a new file with a given extension (default is .md) in /tmp
# Usage: 
#   temp [EXT]
temp() {
    ext="$1"
    [[ -z "$1" ]] && ext="md"
    $EDITOR -c "e /tmp/temp_$(date +%F_%H_%M_%S).$ext | :cd %:p:h"
}

# TODO update / tidy up
bsc() {
    basename "$1" | xclip
}

# TODO update / tidy up
rlc() {
    readlink -f "$1" | xclip
}

# TODO update / tidy up
recent () {
    history \
        | grep "$1" \
        | grep -v "recent $1" \
        | grep -v "grep $1" \
        | tail -1
}

# TODO update / tidy up
auf() {
    ps ax \
        | grep -v grep \
        | grep -i "${1}" \
        | awk '{print $1}'
}

# TODO update / tidy up
svndiff() {
    sep="\n$(perl -e 'print("@" x 100);')\n"

    svn diff "$@" \
        | awk -v sep="$sep" '/^Index: / {print sep} {print}' \
        | bat --language diff
}

# TODO update / tidy up
c() {
    if [ -z "$1" ]; then
        cd
    elif [ "$(find "$1" -maxdepth 1 -type f \
               | head -n 51 \
               | wc -l)" \
           -gt 50 ]; then
        cd "$1"
        echo "Large dir"
    else
        cd "$1" && ls
    fi
}

# TODO update / tidy up
tmux-clean() {
    echo "Sucessfully killed unattached Tmux sessions."
    echo "--------------------------------------------"
    echo "Before:"
    tmux ls
    tmux ls \
        | grep -v attached \
        | cut -d: -f1 \
        | xargs -I{} tmux kill-session -t {}
    echo "After:"
    tmux ls
}

# --------------------------------------------
# FZF functions
# --------------------------------------------

# TODO update / tidy up
# Copy using fzf
fcp() {
    cp -v "$1" "$(awk '{print $2}' ~/.config/directories \
                    | fzf \
                    | sed "s|~|$HOME|")"
}

# TODO update / tidy up
# Edit scripts (using fzf)
se() {
    du -a $BIN/* ~/.local/bin/* \
        | awk '{print $2}' \
        | fzf --preview 'bat --color always {}' \
        | xargs -ro $EDITOR
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
        --preview-window=right:60%:wrap
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
        --preview-window=right:60%:wrap
  )" || return
  $EDITOR "$file" || return
}

# TODO update / tidy up
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

# -----------------------
# Directory
# -----------------------

# TODO update / tidy up
# fd - cd to selected directory
fd() {
  local dir
  dir="$(
    find "${1:-.}" -path '*/\.*' -prune \
        -o -type d -print 2> /dev/null \
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

  if [[ "$current_window" -eq "$target_window" ]]; then
    tmux select-pane -t "$target_window.$target_pane"
  else
    tmux select-pane -t "$target_window.$target_pane" \
      && tmux select-window -t "$target_window"
  fi
}
