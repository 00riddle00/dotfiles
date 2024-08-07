#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-07 23:00:29 EEST
# Path:   ~/.config/zsh/functions.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# Make a temp backup
bk() { cp "$1" "$1.bak"; }

# Make an alias for zsh
#   ex. usage (called from specific directory):
#      ma "vedit" "vim $(readlink -f file_to_edit.txt)"
#      ma "cddir" "cd $(pwd)"
ma() { echo alias "$1='$2'" >> "$ZDOTDIR/aliases.zsh"; echo "***Alias added***\nalias $1='$2'"; zsh }

# Make an alias for zsh to cd into current dir.
macd() { echo alias "$1='cd $(pwd)'" >> "$ZDOTDIR/aliases.zsh"; echo "***Alias added***\nalias $1='cd $(pwd)'"; zsh }

# Systemwide functions

## Find command in history
his() { history | grep "$1"; }

jr() { javac "$1" && java $(echo $1 | sed 's/.java//') $(echo "${@:2}"); }

# Add numbers to non empty lines in a file
# Usage: num <file>
num() { nl -s ' ' "$1" > tmp && mv tmp "$1" && sed "s/^[ \t]*//" -i "$1" && cat "$1" | xclip }

# Go to command's flag description in  manpage, ex. `manf grep -r`
manf () { man "$1" | less -p "^ +$2"; }

# Returns "A" \ "B" (subtracting identical lines)
a_minus_b() { grep -Fvx -f "$2" "$1" | sort; }

# Removes lines from file "A" which contain string from file "B"
a_minus_string_in_b() { grep -Fv -f "$2" "$1" | sort; }

a_and_string_in_b() { grep -F -f "$2" "$1" | sort; }

# Returns "A" & "B" (identical lines)
a_and_b() { comm -12 <( sort "$1" ) <( sort "$2" ) }

# Returns "A" U "B" (union of lines, removes duplicate lines)
a_union_b() { cat "$1" "$2" | sort -u }

# Find all files from current folder | prints extension of files if any | make a unique sorted list
ext() { find . -type f | perl -ne 'print $1 if m/\.([^.\/]+)$/' | sort -u; }

# Copy arguments to clipboard
sel() { echo "$@" | xclip}

get-mp3() { youtube-dl --no-playlist --extract-audio --audio-format mp3 "$1"; }

yy() { name="${1%.asm}"; yasm "$name.asm" -fbin -o "$name.com"; }

# Opens a temporary file with a given extension
# (default extension: .md)
# File is opened in /tmp dir, it's name contains a timestamp
temp() {
    ext="$1";
    [[ -z "$1" ]] && ext="md"
    vim -c "e /tmp/temp_$(date +%F_%H_%M_%S).$ext | :cd %:p:h"
}

# Usage: fields <file>
fields () {
    awk -F"\t" '{print NF}' "$1" | uniq -c
}

# Usage: fields <file>
fields-csv () {
    awk -F, '{print NF}' "$1" | uniq -c
}

# Usage: cols <col_no> <file>
# $1 - col no
# $2 - file name
cols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort | uniq
}

# Usage: cols <col_no> <file>
# $1 - col no
# $2 - file name
colss () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort
}

# Usage: cols <col_no> <file>
cols-csv () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F, -f <(echo "$col_no") "$2" | sort | uniq
}

# Usage: cols <col_no> <file>
ncols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort -n | uniq
}

# Usage: pcols <col_no> <file>
pcols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | perl -e '@data = map {[split(/\t/,$_)]} <>; print map {join("\t",@$_)} sort {$a->[0] <=> $b->[0]} @data' | uniq
}

# Convert epoch to human-readable date
# Usage: epoch-to-date 1643234400
# Output: 2022-01-27
epoch-to-date() {
    date  -d @"$1" "+%F"
}

# Convert epoch to human-readable date
# Usage: date-to-epoch 2022-01-27
# Output: 1643234400
date-to-epoch() {
    date  -d "$1" "+%s"
}

ddif() {
    meld \
        <( cat "$1" | (sed -u 1q; sort -k1 -n) ) \
        <( cat "$2" | (sed -u 1q; sort -k1 -n) ) \
}

bsc() {
    basename "$1" | xclip
}

rlc() {
    readlink -f "$1" | xclip
}

catc() {
    cat "$1" | xclip
}

# Searches hidden files as well
find.file() {
    find . -iname "*${1}*" | sort -u
}

# Does not search hidden files
find.file.abs() {
    readlink -f **/** | grep -i "${1}" | sort -u
}

recent ()
{
    history | grep "$1" | grep -v "recent $1" | grep -v "grep $1" | tail -1
}

auf() {
    ps ax | grep -v grep | grep -i "${1}" | awk '{print $1}'
}

svndiff() {
  sep="\n$(perl -e 'print("@" x 100);')\n"

  svn diff "$@" \
  | awk -v sep="$sep" '/^Index: / {print sep} {print}' \
  | bat --language diff
}

c() {
  if [ -z "$1" ]; then
    cd
  elif [ "$(find "$1" -maxdepth 1 -type f | head -n 51 | wc -l)" -gt 50 ]; then
    cd "$1"
    echo "Large dir"
  else
    cd "$1" && ls
  fi
}

out() {
    if [ -z "$1" ]; then
        echo "Usage: out <file>"
    else
        $EDITOR "outputs/${1%.com}."*
    fi
}

sedit() {
    $EDITOR "$(which "$1")"
}

tmux-clean() {
    echo "Sucessfully killed unattached Tmux sessions."
    echo "--------------------------------------------"
    echo "Before:"
    tmux ls
    tmux ls | grep -v attached | cut -d: -f1 | xargs -I{} tmux kill-session -t {}
    echo "After:"
    tmux ls
}

# Find different file extensions, exluding ./.git, ./venv and ./.idea dirs.
files-ext() {
    find . -path ./.git -o -path ./venv -prune -o -path ./.idea -prune -o -type f \
    | sed -rn 's|.*/[^/]+\.([^/.]+)$|\1|p' \
    | sort -u
}

function kk() {
    cp -rv "$1" "${HOME}/backups/${1}.$(date +%F_%R_%S).bak"
    cp -rv "$1" "${DROPBOX}/backup/${1}.$(date +%F_%R_%S).bak"
}

open() {
    vim $(codid2file "$1")
}

# Copy using fzf
fcp() { cp -v "$1" "$(awk '{print $2}' ~/.config/directories | fzf | sed "s|~|$HOME|")" ; }

# Edit scripts (using fzf)
se() { du -a $BIN/* ~/.local/bin/* | awk '{print $2}' | fzf --preview 'bat --color always {}' | xargs -ro $EDITOR ; }

# -----------------------------------------------------------------------------
# FZF functions
# -----------------------------------------------------------------------------

# ---------------------------------------
# File
# ---------------------------------------

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

# ---------------------------------------
# Directory
# ---------------------------------------

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

# ---------------------------------------
# History
# ---------------------------------------

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

# ---------------------------------------
# PID
# ---------------------------------------

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

# ---------------------------------------
# Tmux
# ---------------------------------------

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
