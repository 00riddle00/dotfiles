
# MAIN USER FUNCTIONS

## copy argument to clipboard
function kk() { echo "${MAIN_HOME}/backups/${1}-$(date +%F_%R).bak ${MAIN_HOME}/Dropbox/sync/backup/${1}-$(date +%F_%R).bak"| xargs -n 1 cp -rv ${1}; }
#function kk() { s cp -r "$1" $MAIN_HOME/backups/"$1"-"$(date +%F_%R)".bak;}
#function kk() { s cp -r "$1" $MAIN_HOME/backups/"$1"_"$(date)".bak;}
#alias pic='scrot -s $MAIN_HOME/Screenshots/screenshot-%F-%H%M%S.png'

## make cmd aliases
function ma() { echo alias $1="'$2'" >> $ZDOTDIR/aliases.zsh; zsh; }

## copy to mif
function mif.send() { scp -rp $MAIN_HOME/Downloads/"$1" togi3017@uosis.mif.vu.lt:/stud3/2015/togi3017/Desktop; }

## copy from mif
function mif.get() { scp -rp togi3017@uosis.mif.vu.lt:/stud3/2015/togi3017/Desktop/"$1" $MAIN_HOME/Downloads; }


# SYSTEMWIDE FUNCTIONS

## scp argument to server
function toserv() { scp $1 root@tomasgiedraitis.com:/home/riddle; }

## unmount argument volume
function de() { sudo udisks --unmount /dev/$1; }

## unbind cmd from current shell
function op() { nohup $1 & disown;}

## combine cd & ls
function cdd() { cd $1; ls;}

## find command in history
function his() { history | grep $1; }

## copy argument to clipboard
function copy() { echo "$@" | xclip -selection clipboard;}

function jr() { javac $1 && java $(echo $1 | sed 's/.java//') $(echo "${@:2}"); }
function num() { nl -s ' ' ${1} > tmp && mv tmp ${1} && sed "s/^[ \t]*//" -i ${1} && cat ${1} | xclip }
