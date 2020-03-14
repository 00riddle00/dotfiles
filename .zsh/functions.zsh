# MAIN USER FUNCTIONS

## temp backup
function bk() { cp "$1" "$1.bak"; }

## make cmd aliases
function ma() { echo alias "$1='$2'" >> "$ZDOTDIR/aliases.zsh"; zsh; }

# SYSTEMWIDE FUNCTIONS

## find command in history
function his() { history | grep "$1"; }

function jr() { javac "$1" && java $(echo $1 | sed 's/.java//') $(echo "${@:2}"); }

# usage: num file.txt, where file.txt is the file to be line-numbered
function num() { nl -s ' ' "$1" > tmp && mv tmp "$1" && sed "s/^[ \t]*//" -i "$1" && cat "$1" | xclip }

# if 1st arg is a dir, no "/" should be appended
function sym() { ln -s "$(pwd)/$1" "$2"; }
function sym.dir() { ln -s "$(pwd)/$1" "$2/$1"; }
function sym.home() { ln -s "$(pwd)/$1" "${MAIN_HOME}/$1"; }

# go to command with a flag in man, ex. `mango grep -r`
function mango () { man "$1" | less -p "^ +$2"; }

# returns "A" \ "B" (subtracting identical lines)
function a_minus_b() { grep -Fvx -f "$2" "$1"; }

# find all files from current folder | prints extension of files if any | make a unique sorted list
function ext() { find . -type f | perl -ne 'print $1 if m/\.([^.\/]+)$/' | sort -u; }
