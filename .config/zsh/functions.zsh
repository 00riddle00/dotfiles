# MAIN USER FUNCTIONS

## make a temp backup
bk() { cp "$1" "$1.bak"; }

## make cmd aliases
ma() { echo alias "$1='$2'" >> "$ZDOTDIR/aliases.zsh"; zsh; }

# SYSTEMWIDE FUNCTIONS

## find command in history
his() { history | grep "$1"; }

jr() { javac "$1" && java $(echo $1 | sed 's/.java//') $(echo "${@:2}"); }

# usage: num file.txt, where file.txt is the file to be line-numbered
num() { nl -s ' ' "$1" > tmp && mv tmp "$1" && sed "s/^[ \t]*//" -i "$1" && cat "$1" | xclip }

# if 1st arg is a dir, no "/" should be appended
sym() { ln -s "$(pwd)/$1" "$2"; }
sym.dir() { ln -s "$(pwd)/$1" "$2/$1"; }

# go to command's flag description in  manpage, ex. `manf grep -r`
manf () { man "$1" | less -p "^ +$2"; }

# returns "A" \ "B" (subtracting identical lines)
a_minus_b() { grep -Fvx -f "$2" "$1"; }

# find all files from current folder | prints extension of files if any | make a unique sorted list
ext() { find . -type f | perl -ne 'print $1 if m/\.([^.\/]+)$/' | sort -u; }

