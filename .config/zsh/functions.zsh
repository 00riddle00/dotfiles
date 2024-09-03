# vim:tw=79:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-09-04 00:51:47 EEST
# Path:   ~/.config/zsh/functions.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# --------------------------------------------
# Creating aliases
# --------------------------------------------

#* Create a Zsh alias.
#* USAGE e.g.:
#*   ${0} "vedit" "vim $(readlink -f file_to_edit.txt)"
#*   ${0} "cdhere" "cd $(pwd)"
#**
ma() {
  echo alias "${1}  '${2}'" >> "${ZDOTDIR}/aliases.zsh"
  echo "*** Alias added ***"
  echo "alias ${1}  '${2}'"
  source "${ZDOTDIR}/.zshrc"
}

#* Create a Zsh alias to cd into current directory.
#* USAGE e.g.:
#*   ${0} "cdhere"
#**
macd() {
  echo alias "${1}='cd $(pwd)'" >> "${ZDOTDIR}/aliases.zsh"
  echo "*** Alias added ***
  alias ${1}='cd $(pwd)'"
  source "${ZDOTDIR}/.zshrc"
}

# --------------------------------------------
# Backups
# --------------------------------------------

#* Make a backup of a file in the current directory.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2] ...
#**
bk() {
  for item in "${@}" ; do
    cp -r "${item}" "${item}.bak"
  done
}

#* Make a backup of a file both in local disk and remote location.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2] ...
#**
kk() {
  for item in "${@}" ; do
    cp -rv "${item}" "${HOME}/backups/${item}.$(date +%F_%R_%S).bak"
    cp -rv "${item}" "${DROPBOX}/backups/${item}.$(date +%F_%R_%S).bak"
  done
}

kk() {
  for item in "${@}" ; do
    cp -rv "${item}" "${HOME}/backups/$(basename "${item}").$(date +%F_%R_%S).bak"
    cp -rv "${item}" "${DROPBOX}/backups/$(basename "${item}").$(date +%F_%R_%S).bak"
  done
}


# --------------------------------------------
# Find
# --------------------------------------------

#* Find files / directories (incl. hidden ones) in the current directory
#* (recursively) by a case-insensitive pattern for a substring of the filename /
#* directory name.
#* USAGE:
#*  ${0} PATTERN
#**
find.file() {
  find . -iname "*${1}*" \
    | sort -u
}

#* Find relative paths (incl. paths to hidden files and directories) starting
#* from the current directory (recursively) by a case-insensitive pattern for a
#* substring of the relative path.
#* USAGE:
#*  ${0} PATTERN
#**
find.path() {
  {
   readlink -f **/** ;
   readlink -f **/.* ;
  } \
    | sed "s|$(pwd)||" \
    | grep -i "${1}" \
    | sort -u
}

#* List all file extensions in the current directory (recursively).
#* USAGE:
#*   ${0}
#**
ext() {
  find . -type f \
    | perl -ne 'print ${1} if m|\.([^.\/]+)$|' \
    | sort -u
}

#* List all file extensions in the current directory (recursively), excluding
#* .git/, .idea/, venv/ directories and dotfiles.
#* USAGE:
#*   ${0}
#**
ext-filtered() {
  find . \
    -path ./.git  -prune \
    -o -path ./.venv -prune \
    -o -path ./.idea -prune \
    -o -type f \
      | perl -ne 'print "${1}\n" if m|.*/[^/]+\.([^/.]+)$|' \
      | sort -u
}

# --------------------------------------------
# Set operations on files (linewise)
# --------------------------------------------

#* Perform A U B (union of lines, without duplicates).
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_union_b() {
  cat "${1}" "${2}" \
    | sort -u
}

#* Perform A & B (intersection of lines).
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_and_b() {
  comm -12 <( sort "${1}" ) <( sort "${2}" )
}

#* Get all lines from A which contain a string from B.
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_and_string_in_b() {
  grep -F -f "${2}" "${1}" \
    | sort
}

#* Perform A \ B (subtract lines from A which appear in B).
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_minus_b() {
  grep -Fvx -f "${2}" "${1}" \
    | sort
}

#* Remove lines from A which contain a string from B.
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_minus_string_in_b() {
  grep -Fv -f "${2}" "${1}" \
    | sort
}

# --------------------------------------------
# Structured data files
# --------------------------------------------

#* Show the summary of the number of fields in each line in a DSV
#* (delimiter-separated values) file.
#* USAGE:
#*   ${0} SEP_NAME FILE1 [FILE2 ...]
#* Grammar (ABNF):
#*   SEP_NAME = "comma" / "semicolon" / "tab" / "whitespace"
#**
fieldc () {
  local separator
  case "${1}" in
    comma)      separator=","  ;;
    semicolon)  separator=";"  ;;
    tab)        separator="\t" ;;
    whitespace) separator=" "  ;;
    *)          echo "Unsupported separator: ${1}" >&2 ; return 1 ;;
  esac
  shift

  for file in "${@}" ; do
    echo "${file}"
    awk -F"${separator}" '{print NF}' "${file}" \
      | uniq -c
  done
}

#* Show all values (sorted) of a given column in a DSV (delimiter-separated
#* values) file.
#* USAGE:
#*   ${0} SEP_NAME COL_NO FILE1 [FILE2 ...]
#* Grammar (ABNF):
#*   SEP_NAME = "comma" / "semicolon" / "tab" / "whitespace"
#**
colv () {
  local separator
  case "${1}" in
    comma)      separator=","  ;;
    semicolon)  separator=";"  ;;
    tab)        separator="\t" ;;
    whitespace) separator=" "  ;;
    *)          echo "Unsupported separator: ${1}" >&2 ; return 1 ;;
  esac
  shift

  col_no="\$${1}"
  awk_stmt="{print ${col_no}"

  for file in "${@}" ; do
    echo "${file}"
    awk -F"${separator}" -f <(echo "${awk_stmt}") "${2}" \
      | sort
  done
}

# --------------------------------------------
# Timestamps
# --------------------------------------------

#* Convert a Unix epoch to a human-readable date.
#* USAGE e.g.:
#*   ${0} 1640988000 [1643752800 ...]
#**
epoch-to-date() {
  for epoch in "${@}" ; do
    date -d @"${epoch}" "+%F"
  done
}

#* Convert a human-readable date to a Unix epoch.
#* USAGE e.g.:
#*   ${0} 2022-01-01 [2022-02-02 ...]
#**
date-to-epoch() {
  for date_ in "${@}" ; do
    date -d "${date_}" "+%s"
  done
}

# --------------------------------------------
# Misc
# --------------------------------------------

#* List all PIDs of processes containing a given string in their name.
#* USAGE:
#*   ${0} STRING
#**
auf() {
  ps ax \
    | grep -v grep \
    | grep -i "${1}" \
    | awk '{print $1}'
}

#* Copy the basename of a file / directory to the clipboard.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#**
bsc() {
  for item in "${@}" ; do
    basename "${item}"
  done \
    | xclip -selection clipboard
}

#* Copy the absolute path of a file / directory to the clipboard.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#**
rlc() {
  for item in "${@}" ; do
    readlink -f "${item}"
  done \
    | xclip -selection clipboard
}

#* cd to a directory and list its contents if it has less than 50 files.
#* USAGE:
#*  ${0} [DIR]
#**
c() {
  if [[ -z "${1}" ]] ; then
    cd
  elif [[ "$(find "${1}" -maxdepth 1 -type f \
           | head -n 51 \
           | wc -l)" \
        -gt 50 ]] ; then
    cd "${1}"
    echo "Large dir"
  else
    cd "${1}" && ls
  fi
}

#* Convert a Git repository's HTTPS URL to an SSH URL.
#* USAGE:
#*   ${0} HTTPS_URL
#**
https_to_ssh() {
  echo "$1" | sed -E 's|https://([^/]+)/([^/]+)/([^/]+)|git@\1:\2/\3|'
}

#* Clone a Git repository using SSH instead of HTTPS.
#* USAGE:
#*  ${0} HTTPS_URL
#**
git_clone_ssh() {
  git clone "$(https_to_ssh $1)"
}

#* Go to a command's flag description in its man page.
#* USAGE e.g.:
#*   ${0} grep -r
#**
manf () {
  man "${1}" \
    | less -p "^ +${2}"
}

#* Show the most recent command containing a given string / substring.
#* USAGE:
#*  ${0} STRING
#**
recent () {
  history -100 \
    | grep "${1}" \
    | grep -v "recent ${1}" \
    | grep -v "grep ${1}" \
    | tail -1
}

#* Display Subversion diffs with enhanced formatting and highlighting.
#* USAGE:
#*  ${0} [FILE1|DIR1 [FILE2|DIR2 ...]]
#**
svndiff() {
  sep="\n$(perl -e 'print("@" x 100);')\n"
  svn diff "${@}" \
    | awk -v sep="${sep}" '/^Index: / {print sep} {print}' \
    | bat --language diff
}

#* Open a new file with a given extension (default is .md) in /tmp for editing.
#* USAGE:
#*   ${0} [EXT]
#**
temp() {
  ext="${1}"
  [[ -z "${1}" ]] && ext="md"
  ${EDITOR} -c "\
    e /tmp/temp_$(date +%F_%H_%M_%S).${ext} \
      | :cd %:p:h \
    "
}

#* Kill all unattached Tmux sessions.
#* USAGE:
#*  ${0}
#**
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
