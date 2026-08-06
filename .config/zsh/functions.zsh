# vim:tw=88:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-06 20:02:48 CEST
# Path:   ~/.config/zsh/functions.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
#
# Table of contents
# -----------------
#   1. Creating aliases
#   2. Navigation
#   3. Backups and disposal
#   4. Find and inspect filesystem
#   5. Clipboard
#   6. Viewing and editing text
#   7. File-name transformations
#   8. String transformations
#   9. Command information
#  10. Processes and terminal sessions
#  11. Temporary files
#  12. Version control
#  13. Python
#  14. Set operations on files (linewise)
#  15. Structured data files
#  16. Timestamps
#  17. Audio and video
#  18. Document conversion
#  19. GitHub Copilot
#  20. Temporary functions

# -----------------------------------------------------------------------------
# 1. Creating aliases
# -----------------------------------------------------------------------------

#* Create a Zsh alias.
#* NOTE: Function 'c()' is used for cd.
#* USAGE e.g.:
#*   ${0} "edit" "${EDITOR} $(readlink -f file_to_edit.txt)"
#*   ${0} "cdhere" "c $(pwd)"
#**
ma() {
  echo alias "${1}  '${2}'" >> "${ZDOTDIR}/aliases.zsh"
  echo "*** Alias added ***"
  echo "alias ${1}='${2}'"
  source "${ZDOTDIR}/.zshrc"
}

#* Create a Zsh alias to cd into current directory.
#* NOTE: Function 'c()' is used for cd.
#* USAGE e.g.:
#*   ${0} "cdhere"
#**
macd() {
  echo alias "${1}='c $(pwd)'" >> "${ZDOTDIR}/aliases.zsh"
  echo "*** Alias added ***
  alias ${1}='c $(pwd)'"
  source "${ZDOTDIR}/.zshrc"
}

# -----------------------------------------------------------------------------
# 2. Navigation
# -----------------------------------------------------------------------------

#* cd to a directory and list its contents if it does not exceed 50 files.
#* USAGE:
#*  ${0} [DIR]
#**
c() {
  if [[ -z "${1}" ]]; then
    builtin cd || return
  elif (("$(command ls "${1}" 2> /dev/null | wc -l)" > 50)); then
    builtin cd "${1}" || return
    echo "Large dir"
  else
    builtin cd "${1}" && command eza "${EZA_COLOR}"
  fi
}

# -----------------------------------------------------------------------------
# 3. Backups and disposal
# -----------------------------------------------------------------------------

#* Make a backup of a file in the current directory.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2] ...
#**
bk() {
  for item in "${@}"; do
    cp -r "${item}" "${item}.bak"
  done
}

#* Make a backup of a file in the current dir with a timestamp in the name.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2] ...
#**
bkd() {
  for item in "${@}"; do
    cp -r "${item}" "${item}.$(date +%F).bak"
  done
}

#* Make a backup of a file both in local disk and remote location.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2] ...
#**
kk() {
  for item in "${@}"; do
    cp -rv "${item}" "${HOME}/backups/$(basename "${item}").$(date +%F_%R_%S).bak"
    cp -rv "${item}" "${DROPBOX}/backups/$(basename "${item}").$(date +%F_%R_%S).bak"
  done
}

#* Move one or more files or directories to ~/wastebasket/.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#**
waste() {
  mv -v -- "${@}" "${HOME}/wastebasket/"
}

# -----------------------------------------------------------------------------
# 4. Find and inspect filesystem
# -----------------------------------------------------------------------------

#* Find files / directories (incl. hidden ones) in the current directory
#* (recursively) by a case-insensitive pattern for a substring of the filename /
#* directory name.
#* USAGE:
#*  ${0} PATTERN
#*
#* EXAMPLES:
#*   ${0} "^a"    # Find files / dirs starting with "A" or "a".
#*   ${0} "\.r$"  # Find files / dirs ending with ".r" or ".R" (R extension).
#**
find.file() {
  fd -i -H "${1}" . \
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
    readlink -f -- **/**
    readlink -f -- **/.*
  } \
    | sed "s|$(pwd)||" \
    | command rg -i "${1}" \
    | sort -u
}

#* List all file extensions in the current directory (recursively).
#* USAGE:
#*   ${0}
#**
ext() {
  fd -H -I -t f . \
    | perl -ne 'print "$1\n" if m|\.([^./]+)$|' \
    | sort -u
}

#* List all file extensions in the current directory (recursively), excluding
#* .git/, .idea/, venv/ directories and dotfiles.
#* USAGE:
#*   ${0}
#**
ext-filtered() {
  fd -t f -H -E .git -E .venv -E venv -E .idea . \
    | perl -ne 'print "$1\n" if m|\.([^./]+)$|' \
    | sort -u
}

#* Check if ${2} is a symlink of ${1}.
#* USAGE:
#*   ${0} TARGET SYMLINK
#**
is_symlink() {
  [[ -L "${2}" && "$(readlink "${2}")" == "${1}" ]]
}

# -----------------------------------------------------------------------------
# 5. Clipboard
# -----------------------------------------------------------------------------

#* Copy the basename of a file / directory to the clipboard.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#**
bc() {
  [[ ${#} -eq 0 ]] && return 0

  for item in "${@}"; do
    basename "${item}"
  done \
    | xclip -selection clipboard
}

#* Copy arguments to the clipboard, one argument per line.
#* Useful for copying file / directory paths, or lists of items.
#*
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#*   ${0} ANY_TEXT_TO_COPY [ANY_OTHER_TEXT ...]
#**
ec() {
  [[ ${#} -eq 0 ]] && return 0

  for item in "${@}"; do
    echo "${item}"
  done \
    | xclip -selection clipboard
}

#* Copy arguments (joined by space) to the clipboard as a single line of text.
#* Useful for copying sentences, commands, search queries, commit messages,
#* or any free-form text.
#*
#* USAGE:
#*   ${0} ANY_TEXT_TO_COPY [ANY_OTHER_TEXT ...]
#**
ecc() {
  [[ ${#} -eq 0 ]] && return 0

  echo "${@}" | xclip -selection clipboard
}

#* Copy the absolute path of a file / directory to the clipboard.
#* USAGE:
#*   ${0} FILE1|DIR1 [FILE2|DIR2 ...]
#**
rlc() {
  if [[ ${#} -eq 0 ]]; then
    printf '%s\n' "${PWD}" | xclip -selection clipboard
    return 0
  fi

  for item in "${@}"; do
    readlink -f "${item}"
  done \
    | xclip -selection clipboard
}

#* Copy command output to the clipboard together with a pseudo-terminal
#* prompt and executed command.
#*
#* Useful for sharing terminal output while preserving context.
#*
#* USAGE:
#*   ${0} COMMAND [ARGUMENTS ...]
#*
#* EXAMPLES:
#*   ${0} tree data
#*   ${0} eza -la
#*   ${0} rg TODO src/
#**
clipcmd() {
  {
    print -r -- "┌─[${HOST} ${PWD/#${HOME}/~}]"
    print -r -- "└─╼ ${(j: :)@}"
    "${@}"
  } | xclip -selection clipboard
}

#* Reverse lines from standard input and copy the result to the system
#* clipboard.
#*
#* Reads multiline text from stdin, reverses line order, prints the result to
#* stdout, and copies the result to clipboard.
#*
#* In interactive use, prints a blank separator line before the reversed output
#* so it does not visually merge with * pasted input.
#*
#* Useful for quickly reversing commit hashes, logs, lists, stack traces,
#* etc.
#*
#* USAGE:
#*   ${0}
#*
#* EXAMPLES:
#*   ${0}
#*   ${0} < commits.txt
#*   ${0} > reversed.txt
#*   ${0} < commits.txt > reversed.txt
#**
reverse-lines() {
  print -u2 'Paste multiline text below.'
  print -u2 'When done, press Ctrl-D.'
  print -u2 'Blank / whitespace-only lines will be ignored.'
  print -u2 'Reversed output will also be copied to clipboard.'
  print -u2 '---'

  local reversed

  reversed="$(awk 'NF' | tac)"

  [[ -t 1 ]] && print

  printf '%s\n' "${reversed}"

  [[ ! -t 1 ]] && {
    print -u2
    printf '%s\n' "${reversed}" > /dev/tty
  }

  printf '%s' "${reversed}" | xclip -selection clipboard

  if [[ -t 1 ]]; then
    print -u2 '[OK] Reversed lines printed and copied to clipboard.'
  else
    print -u2 '[OK] Reversed lines written to a file and copied to clipboard.'
  fi
}

# -----------------------------------------------------------------------------
# 6. Viewing and editing text
# -----------------------------------------------------------------------------

#* Display the first N lines of each file, like 'head' but with colored
#* filenames and visual separators between files. Default: 10 lines per file.
#*
#* USAGE:
#*   ${0} [-n N | -N] FILE1 [FILE2 ...]
#**
chead() {
  local n=10
  if [[ "${1}" == -n ]]; then
    n="${2}"
    shift 2
  elif [[ "${1}" =~ ^-[0-9]+$ ]]; then
    n="${1#-}"
    shift
  fi
  for f in "${@}"; do
    echo -e "\n\033[1;34m══════════════════════════════════════════\033[0m"
    echo -e "\033[1;33m==> ${f} <==\033[0m"
    echo -e "\033[1;34m══════════════════════════════════════════\033[0m"
    head -n "${n}" "${f}"
  done
}

#* Display whole files (or first C lines) with syntax highlighting, colored
#* filenames and visual separators between files.
#*
#* Prefers `cat` if it is aliased/function-wrapped to `bat`. Otherwise falls
#* back to `bat` directly if available.
#*
#* USAGE:
#*   ccat FILE1 [FILE2 ...]
#*   ccat -c N FILE1 [FILE2 ...]
#*   ccat -N FILE1 [FILE2 ...]
#**
ccat() {
  local count=""
  local use_bat=0

  if [[ "${1}" == -c ]]; then
    count="${2}"
    shift 2
  elif [[ "${1}" =~ ^-[0-9]+$ ]]; then
    count="${1#-}"
    shift
  fi

  # Detect whether `cat` is aliased/functioned to bat.
  if alias cat 2> /dev/null | rg -q 'bat'; then
    use_bat=1
  elif command -v bat &> /dev/null; then
    use_bat=1
  fi

  for f in "${@}"; do
    echo -e "\n\033[1;34m══════════════════════════════════════════\033[0m"
    echo -e "\033[1;33m==> ${f} <==\033[0m"
    echo -e "\033[1;34m══════════════════════════════════════════\033[0m"

    if ((use_bat)); then
      if alias cat 2> /dev/null | rg -q 'bat'; then
        if [[ -n "${count}" ]]; then
          cat --paging=never --line-range "1:${count}" -- "${f}"
        else
          cat --paging=never -- "${f}"
        fi
      else
        if [[ -n "${count}" ]]; then
          bat --paging=never --line-range "1:${count}" -- "${f}"
        else
          bat --paging=never -- "${f}"
        fi
      fi
    else
      if [[ -n "${count}" ]]; then
        sed -n "1,${count}p" -- "${f}"
      else
        command cat -- "${f}"
      fi
    fi
  done
}

#* Print one specified line from standard input or a file.
#* USAGE:
#*   COMMAND | ${0} LINE_NO
#*   ${0} LINE_NO FILE
#**
line() {
  local line_no="${1}"

  sed -n "${line_no}p" "${2:-/dev/stdin}"
}

#* Print an inclusive range of lines from standard input or a file.
#* USAGE:
#*   COMMAND | ${0} FIRST_LINE,LAST_LINE
#*   ${0} FIRST_LINE,LAST_LINE FILE
#**
lines() {
  sed -n "${1}p" "${2:-/dev/stdin}"
}

#* Show the contents of an executable file found in PATH.
#*
#* Intended for text-based scripts, not binary executables.
#* USAGE:
#*   ${0} EXECUTABLE
#**
whics() {
  bat "$(whence -p -- "${1}")"
}

#* Edit an executable file found in PATH.
#*
#* Intended for text-based scripts, not binary executables.
#* USAGE:
#*   ${0} EXECUTABLE
#**
sedit() {
  "${EDITOR}" "$(whence -p -- "${1}")"
}

# -----------------------------------------------------------------------------
# 7. File-name transformations
# -----------------------------------------------------------------------------

#* Rename files in the current directory by replacing spaces with underscores.
#* USAGE:
#*   ${0} FILE1 [FILE2 ...]
#**
spaces-to-underscores() {
  for file in "${@}"; do
    new_name=$(printf '%s' "${file}" | sed -E 's/ /_/g')
    if [ "${file}" != "${new_name}" ]; then
      if [ -e "${new_name}" ]; then
        printf 'Skip (exists): %s -> %s\n' "${file}" "${new_name}" >&2
        continue
      fi
      mv -- "${file}" "${new_name}"
      printf 'Renamed: %s -> %s\n' "${file}" "${new_name}"
    else
      printf 'No change: %s\n' "${file}"
    fi
  done
}

#* Rename files in the current directory by converting their names to
#* lowercase.
#* USAGE:
#*   ${0} FILE1 [FILE2 ...]
#**
lowercase() {
  for file in "${@}"; do
    new_name=$(printf '%s' "${file}" | tr '[:upper:]' '[:lower:]')

    if [ "${file}" != "${new_name}" ]; then
      if [ -e "${new_name}" ]; then
        printf 'Skip (exists): %s -> %s\n' "${file}" "${new_name}" >&2
        continue
      fi

      mv -- "${file}" "${new_name}"
      printf 'Renamed: %s -> %s\n' "${file}" "${new_name}"
    else
      printf 'No change: %s\n' "${file}"
    fi
  done
}

#* Rename files in the current directory by converting their names to
#* snake_case.
#* USAGE:
#*   ${0} FILE1 [FILE2 ...]
#**
snake-case() {
  for file in "${@}"; do
    # s/_{3,}/__/g; <- collapse 3+ underscores to "__", preserve "__" as
    # semantic separator
    new_name=$(printf '%s' "${file}" \
      | tr '[:upper:]' '[:lower:]' \
      | sed -E '
        s/[[:space:]]+/_/g;
        s/[^a-z0-9._-]+/_/g;
        s/_{3,}/__/g;
        s/^_+//;
        s/_+$//
      ')

    if [ "${file}" != "${new_name}" ]; then
      if [ -e "${new_name}" ]; then
        printf 'Skip (exists): %s -> %s\n' "${file}" "${new_name}" >&2
        continue
      fi

      mv -- "${file}" "${new_name}"
      printf 'Renamed: %s -> %s\n' "${file}" "${new_name}"
    else
      printf 'No change: %s\n' "${file}"
    fi
  done
}

# -----------------------------------------------------------------------------
# 8. String transformations
# -----------------------------------------------------------------------------

#* Replace spaces with underscores in strings and optionally copy the results.
#* USAGE:
#*   ${0} STRING1 [STRING2 ...]
#**
spaces-to-underscores-str() {
  out=()
  for s in "${@}"; do
    out+=("$(printf '%s' "${s}" | sed -E 's/ /_/g')")
  done

  # Print to terminal
  printf '%s\n' "${out[@]}"

  # Ask to copy to clipboard
  printf 'Copy to clipboard? [y/N]: ' >&2
  read -r ans
  case "${ans}" in
    y | Y | yes | Yes)
      printf '%s\n' "${out[@]}" | xclip -selection clipboard
      printf '(Copied with xclip)\n' >&2
      ;;
    *) : ;;
  esac
}

#* Convert strings to lowercase and optionally copy the results.
#* USAGE:
#*   ${0} STRING1 [STRING2 ...]
#**
lowercase-str() {
  out=()
  for s in "${@}"; do
    out+=("$(printf '%s' "${s}" | tr '[:upper:]' '[:lower:]')")
  done

  # Print to terminal
  printf '%s\n' "${out[@]}"

  # Ask to copy to clipboard
  printf 'Copy to clipboard? [y/N]: ' >&2
  read -r ans
  case "${ans}" in
    y | Y | yes | Yes)
      printf '%s\n' "${out[@]}" | xclip -selection clipboard
      printf '(Copied with xclip)\n' >&2
      ;;
    *) : ;;
  esac
}

#* Convert strings to snake_case and optionally copy the results.
#* USAGE:
#*   ${0} STRING1 [STRING2 ...]
#**
snake-case-str() {
  out=()

  for s in "${@}"; do
    # s/_{3,}/__/g; <- collapse 3+ underscores to "__", preserve "__" as
    # semantic separator
    out+=("$(printf '%s' "${s}" \
      | tr '[:upper:]' '[:lower:]' \
      | sed -E '
        s/[[:space:]]+/_/g;
        s/[^a-z0-9._-]+/_/g;
        s/_{3,}/__/g;
        s/^_+//;
        s/_+$//
      ')")
  done

  printf '%s\n' "${out[@]}"

  printf 'Copy to clipboard? [y/N]: ' >&2
  read -r ans

  case "${ans}" in
    y | Y | yes | Yes)
      printf '%s\n' "${out[@]}" | xclip -selection clipboard
      printf '(Copied with xclip)\n' >&2
      ;;
    *)
      :
      ;;
  esac
}

# -----------------------------------------------------------------------------
# 9. Command information
# -----------------------------------------------------------------------------

#* Use the --help flag of a program or its subcommand.
#* USAGE:
#*   ${0} PROGRAM_NAME [SUBCOMMAND]
#*   ${0} git
#*   ${0} git commit
#**
help() {
  "${@}" --help
}

#* Use the --version flag of a program.
#* USAGE:
#*   ${0} PROGRAM_NAME
#**
version() {
  "${1}" --version
}

#* Go to a command's flag description in its man page.
#* USAGE:
#*   ${0} COMMAND FLAG
#
#* EXAMPLES:
#*   ${0} ls -r
#*   ${0} git-clean -x
#**
manf() {
  man "${1}" \
    | less -p "^ +${2}"
}

#* Show the most recent command containing a given string/substring.
#* USAGE:
#*  ${0} STRING
#**
recent() {
  history -100 \
    | command rg -- "${1}" \
    | command rg -v -- "^\s*[0-9]+\s+recent ${1}\$" \
    | command rg -v -- "^\s*[0-9]+\s+rg ${1}\$" \
    | tail -1
}

# -----------------------------------------------------------------------------
# 10. Processes and terminal sessions
# -----------------------------------------------------------------------------

#* List all PIDs of processes containing a given string in their name.
#* USAGE:
#*   ${0} STRING
#**
auf() {
  ps ax \
    | command rg -v '^[ ]*[0-9]+.*\brg\b' \
    | command rg -i -- "${1}" \
    | awk '{print $1}'
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
    | command rg -v attached \
    | cut -d: -f1 \
    | command xargs -I{} tmux kill-session -t {}
  echo "After:"
  tmux ls
}

# -----------------------------------------------------------------------------
# 11. Temporary files
# -----------------------------------------------------------------------------

#* Open a new file with a given extension (default is .md) in /tmp for editing.
#* USAGE:
#*   ${0} [EXT]
#**
temp() {
  ext="${1}"
  if [[ -z "${ext}" ]]; then
    ext="md"
    tmpfile="/tmp/temp_$(date +%F_%H_%M_%S).${ext}"

    printf \
      '<!-- vim: set ft=markdown tw=88 nu ai et ts=2 sw=2: -->\n\n\n' \
      > "${tmpfile}"

    "${EDITOR}" -c '3' "${tmpfile}"
  else
    tmpfile="/tmp/temp_$(date +%F_%H_%M_%S).${ext}"
    "${EDITOR}" -c "e ${tmpfile} | :cd %:p:h"
  fi
}

# -----------------------------------------------------------------------------
# 12. Version control
# -----------------------------------------------------------------------------

#* Convert a Git repository's HTTPS URL to an SSH URL.
#* USAGE:
#*   ${0} HTTPS_URL
#**
https_to_ssh() {
  echo "${1}" | sed -E 's|https://([^/]+)/([^/]+)/([^/]+)|git@\1:\2/\3|'
}

#* Clone a Git repository using SSH instead of HTTPS.
#* USAGE:
#*  ${0} HTTPS_URL
#**
git_clone_ssh() {
  git clone "$(https_to_ssh "${1}")"
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

#* Run Git commands against the bare dotfiles repository.
#* Implemented as a function so Git completion can be assigned to it with
#* `compdef dot=git` in ${ZDOTDIR}/.zshrc
#* USAGE:
#*   ${0} GIT_ARGUMENTS...
#**
dot() {
  /usr/bin/git --git-dir="${HOME}/.dotfiles/" --work-tree="${HOME}" "${@}"
}

#* Open the bare dotfiles repository in lazygit.
#* USAGE:
#*   ${0} [LAZYGIT_ARGUMENTS...]
#**
dot-lazygit() {
  lazygit -g "${HOME}/.dotfiles" -w "${HOME}" "${@}"
}

#* Open the bare dotfiles repository in tig.
#* USAGE:
#*   ${0} [TIG_ARGUMENTS...]
#**
dot-tig() {
  GIT_DIR="${HOME}/.dotfiles" GIT_WORK_TREE="${HOME}" tig "${@}"
}

# -----------------------------------------------------------------------------
# 13. Python
# -----------------------------------------------------------------------------

#* Run a command in a uv-managed Python environment.
#* Implemented as a function so standard Python completion can be assigned to
#* it with `compdef uv-run=python` in ${ZDOTDIR}/.zshrc
#* USAGE:
#*   ${0} FILE [ARGUMENTS ...]
#**
uv-run() {
  uv run "${@}"
}

# -----------------------------------------------------------------------------
# 14. Set operations on files (linewise)
# -----------------------------------------------------------------------------

#* Perform A U B (union of lines, without duplicates).
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_union_b() {
  command cat "${1}" "${2}" \
    | sort -u
}

#* Perform A & B (intersection of lines).
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_and_b() {
  comm -12 <(sort "${1}") <(sort "${2}")
}

#* Get all lines from A which contain a string from B.
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_and_string_in_b() {
  command rg -F -f "${2}" "${1}" \
    | sort
}

#* Perform A \ B (subtract lines from A which appear in B).
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_minus_b() {
  command rg -Fvx -f "${2}" "${1}" \
    | sort
}

#* Remove lines from A which contain a string from B.
#* USAGE:
#*   ${0} FILE1 FILE2
#**
a_minus_string_in_b() {
  command rg -Fv -f "${2}" "${1}" \
    | sort
}

# --------------------------------------------
# 15. Structured data files
# --------------------------------------------

#* Show the summary of the number of fields in each line in a DSV
#* (delimiter-separated values) file.
#* USAGE:
#*   ${0} SEP_NAME FILE1 [FILE2 ...]
#* Grammar (ABNF):
#*   SEP_NAME = "comma" / "semicolon" / "tab" / "whitespace"
#**
fieldc() {
  local separator
  case "${1}" in
    comma) separator="," ;;
    semicolon) separator=";" ;;
    tab) separator="\t" ;;
    whitespace) separator=" " ;;
    *)
      echo "Unsupported separator: ${1}" >&2
      return 1
      ;;
  esac
  shift

  for file in "${@}"; do
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
colv() {
  local separator
  case "${1}" in
    comma) separator="," ;;
    semicolon) separator=";" ;;
    tab) separator="\t" ;;
    whitespace) separator=" " ;;
    *)
      echo "Unsupported separator: ${1}" >&2
      return 1
      ;;
  esac
  shift

  col_no="\$${1}"
  awk_stmt="{print ${col_no}}"
  shift

  for file in "${@}"; do
    echo "${file}"
    awk -F"${separator}" -f <(echo "${awk_stmt}") "${file}" \
      | sort
  done
}

# --------------------------------------------
# 16. Timestamps
# --------------------------------------------

#* Convert a Unix epoch to a human-readable date.
#* USAGE e.g.:
#*   ${0} 1640988000 [1643752800 ...]
#**
epoch-to-date() {
  for epoch in "${@}"; do
    date -d @"${epoch}" "+%F"
  done
}

#* Convert a human-readable date to a Unix epoch.
#* USAGE e.g.:
#*   ${0} 2022-01-01 [2022-02-02 ...]
#**
date-to-epoch() {
  for date_ in "${@}"; do
    date -d "${date_}" "+%s"
  done
}

#* Convert a Unix epoch to a human-readable datetime.
#* USAGE e.g.:
#*   ${0} 1640988000 [1643752800 ...]
#**
epoch-to-datetime() {
  for epoch in "${@}"; do
    date -d @"${epoch}" "+%F %T"
  done
}

#* Convert a human-readable datetime to a Unix epoch.
#* USAGE e.g.:
#*   ${0} "2022-01-01 13:45:00" ["2022-02-02 08:00:00" ...]
#**
datetime-to-epoch() {
  for datetime in "${@}"; do
    date -d "${datetime}" "+%s"
  done
}

# -----------------------------------------------------------------------------
# 17. Audio and video
# -----------------------------------------------------------------------------

#* Cut a section from a media file via ffmpeg.
#*
#* Cuts a media file from <start> to <end> using stream-copy.
#* Accepts ffmpeg timestamp formats:
#*   30       → 30 seconds
#*   4:20     → 4 minutes, 20 seconds
#*   1:04:20  → 1 hour, 4 minutes, 20 seconds
#*
#* Creates the output next to the input file and includes normalized
#* start/end timestamps in its filename.
#*
#* Needs: ffmpeg
#* Notes: stream-copy is fast and lossless, but video cuts may begin at
#*        the nearest keyframe rather than the exact requested frame.
#*
#* USAGE:
#*   ${0} MEDIA_FILE START_TIME END_TIME
#* EXAMPLES:
#*   ${0} "meeting.mp3" 4:20 30:00
#*   # Creates: meeting__00_04_20__00_30_00.mp3
#**
ffcut() {
  if ((${#} != 3)); then
    print -u2 "Usage: ffcut MEDIA_FILE START_TIME END_TIME"
    return 1
  fi

  local input="${1}"
  local start="${2}"
  local end="${3}"

  if [[ ! -f "${input}" ]]; then
    print -u2 "Input file does not exist: ${input}"
    return 1
  fi

  local start_label
  local end_label

  start_label="$(_ffcut_timestamp_label "${start}")" || return 1
  end_label="$(_ffcut_timestamp_label "${end}")" || return 1

  local output="${input:r}__${start_label}__${end_label}.${input:e}"

  print "→ Cutting '${input}' from ${start} to ${end}…"

  ffmpeg \
    -i "${input}" \
    -ss "${start}" \
    -to "${end}" \
    -map 0 \
    -c copy \
    "${output}"
}

#* Convert an ffmpeg timestamp into a filename-safe HH_MM_SS label.
#* USAGE:
#*   ${0} FFMPEG_TIMESTAMP
#**
_ffcut_timestamp_label() {
  local timestamp="${1}"
  local -a parts
  local hours minutes seconds

  parts=("${(@s/:/)timestamp}")

  case "${#parts[@]}" in
    1)
      hours=0
      minutes=0
      seconds="${parts[1]}"
      ;;
    2)
      hours=0
      minutes="${parts[1]}"
      seconds="${parts[2]}"
      ;;
    3)
      hours="${parts[1]}"
      minutes="${parts[2]}"
      seconds="${parts[3]}"
      ;;
    *)
      print -u2 "Invalid timestamp: ${timestamp}"
      return 1
      ;;
  esac

  printf '%02d_%02d_%02d' "${hours}" "${minutes}" "${seconds}"
}

#* Concatenate media files via ffmpeg.
#*
#* Concatenates ≥2 files of the same format into one output.
#* Auto-selects method by extension:
#*   mkv/ts/mpg → stream-copy
#*   mp4        → copy, fallback to re-encode (H.264 + AAC)
#*   other      → always re-encode
#*
#* Inputs are converted to absolute paths to avoid /proc/self/fd issues.
#* Skips the output file if it appears among inputs.
#*
#* Needs: ffmpeg, realpath
#* Notes: identical codecs required for -c copy mode; fallback ensures success.
#*
#* USAGE:
#*   ${0} INPUT_FILE1 INPUT_FILE2 [INPUT_FILE3 ...] OUTPUT_FILE
#* EXAMPLES:
#*   ${0} "part1.mp4" "part2.mp4" "merged.mp4"
#**
ffcat() {
  if [ "${#}" -lt 3 ]; then
    echo "Usage: ffcat <file1> <file2> [file3 ...] <output>" >&2
    return 1
  fi

  # Last argument is the output file.
  local out="${@[-1]}"
  out_abs="$(realpath -m -- "${out}")" || {
    echo "Bad output path: ${out}" >&2
    return 1
  }

  # Inputs are all arguments except the last.
  infiles=("${@:1:$((${#} - 1))}")

  first="${1}"
  ext="${first##*.}"
  ext="$(printf '%s' "${ext}" | tr '[:upper:]' '[:lower:]')"

  # Build concat list with absolute paths, skipping the output file.
  concat_list=""
  kept=0

  for f in "${infiles[@]}"; do
    [ -z "${f}" ] && continue

    absf="$(realpath -- "${f}")" || {
      echo "Missing file: ${f}" >&2
      return 1
    }

    if [ "${absf}" = "${out_abs}" ]; then
      echo "Note: skipping output file in inputs: ${f}" >&2
      continue
    fi

    concat_list+="file '$(printf '%s' "${absf}")'\n"
    kept=$((kept + 1))
  done

  if [ "${kept}" -lt 2 ]; then
    echo \
      "Need at least two input files after filtering; got ${kept}." \
      >&2
    return 1
  fi

  case "${ext}" in
    mkv | ts | mpg)
      echo "→ Concatenating as .${ext} (stream copy)…"

      ffmpeg \
        -loglevel info \
        -f concat \
        -safe 0 \
        -i <(printf '%b' "${concat_list}") \
        -c copy \
        "${out}"
      ;;

    mp4)
      echo "→ Concatenating as .mp4 (safe copy attempt)…"

      if ! ffmpeg \
        -loglevel info \
        -f concat \
        -safe 0 \
        -i <(printf '%b' "${concat_list}") \
        -c copy \
        -movflags +faststart \
        "${out}"; then
        echo "⚠️ Copy failed — re-encoding as fallback…"

        ffmpeg \
          -loglevel info \
          -f concat \
          -safe 0 \
          -i <(printf '%b' "${concat_list}") \
          -c:v libx264 \
          -crf 18 \
          -preset veryfast \
          -c:a aac \
          -b:a 192k \
          -movflags +faststart \
          "${out}"
      fi
      ;;

    *)
      echo "⚠️ Unknown extension '.${ext}' — re-encoding to be safe…"

      ffmpeg \
        -loglevel info \
        -f concat \
        -safe 0 \
        -i <(printf '%b' "${concat_list}") \
        -c:v libx264 \
        -crf 18 \
        -preset veryfast \
        -c:a aac \
        -b:a 192k \
        "${out}"
      ;;
  esac
}

# -----------------------------------------------------------------------------
# 18. Document conversion
# -----------------------------------------------------------------------------

#* Merge image files into document.pdf.
#* Accepts PNG, JPEG, and TIFF images; skips unsupported files with a warning.
#* USAGE:
#*   ${0} IMAGE1 [IMAGE2 ...]
#* EXAMPLE:
#*   ${0} *.png *.jpg
#**
getpdf() {
  if ((${#} == 0)); then
    print "Usage: getpdf <images...>" >&2
    return 1
  fi

  for f in "${@}"; do
    [[ ${f} =~ \.(png|jpg|jpeg|tif|tiff)$ ]] || {
      print "Skipping non-image: ${f}" >&2
      continue
    }
  done

  magick "${@}" document.pdf
}

#* Convert a document to Markdown with Marker and write the output under the
#* current directory.
#* Previously named marker-pdf (for shell-history reference).
#* USAGE:
#*   ${0} INPUT
#**
marker-md() {
  marker_single "${1}" \
    --output_dir .
}

# -----------------------------------------------------------------------------
# 19. GitHub Copilot
# -----------------------------------------------------------------------------

# Replaced with an alias in aliases.zsh because no function-specific argument
# handling is needed.
#??() {
#  copilot -i "${*}"
#}

#* Get a one-shot GitHub Copilot response.
#* USAGE:
#*   ${0} PROMPT...
#**
cpo() {
  copilot -p "${*}"
}

#* Get a one-shot GitHub Copilot response suitable for shell commands.
#* USAGE:
#*   ${0} PROMPT...
#**
cpos() {
  copilot -s -p "${*}"
}

#* Ask GitHub Copilot to explain a command.
#* USAGE:
#*   ${0} COMMAND...
#**
what() {
  copilot -p "Explain this command: ${*}"
}

#* Ask GitHub Copilot to explain a command and each of its flags.
#* USAGE:
#*   ${0} COMMAND...
#**
why() {
  copilot -i "Explain this command and what each flag does: ${*}"
}

# -----------------------------------------------------------------------------
# 20. Temporary functions (maybe they will stick)
# -----------------------------------------------------------------------------
