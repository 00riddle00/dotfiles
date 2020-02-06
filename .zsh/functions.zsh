# MAIN USER FUNCTIONS

## copy argument to clipboard
function bk() { cp "$1" "$1.bak"; }
function kk() { echo "${MAIN_HOME}/backups/${1}-$(date +%F_%R).bak ${MAIN_HOME}/Dropbox/sync/backup/${1}-$(date +%F_%R).bak"| xargs -n 1 cp -rv ${1}; }

## make cmd aliases
function ma() { echo alias "$1='$2'" >> "$ZDOTDIR/aliases.zsh"; zsh; }

## copy to mif
function mif.send() { scp -rp "$MAIN_HOME/Downloads/$1" "togi3017@uosis.mif.vu.lt:/stud3/2015/togi3017/Desktop"; }
function g.send() { scp -rp "$MAIN_HOME/Downloads/$1" "root@192.168.1.244:/home/riddle"; }

## copy from mif
function mif.get() { scp -rp "togi3017@uosis.mif.vu.lt:/stud3/2015/togi3017/Desktop/$1" "$MAIN_HOME/Downloads"; }
function g.get() { scp -rp "root@192.168.1.244:/home/riddle/to_ssh" "$MAIN_HOME/Downloads"; }


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

