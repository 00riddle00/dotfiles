# MAIN USER FUNCTIONS

## make a temp backup
bk() { cp "$1" "$1.bak"; }

## make an alias for zsh
## ex. usage (called from specific directory):
##      ma "vedit" "vim $(readlink -f file_to_edit.txt)"
##      ma "cddir" "cd $(pwd)"
ma() { echo alias "$1='$2'" >> "$ZDOTDIR/aliases.zsh"; zsh; }

## make an alias for zsh to cd into current dir.
macd() { echo alias "$1='cd $(pwd)'" >> "$ZDOTDIR/aliases.zsh"; zsh; }

# SYSTEMWIDE FUNCTIONS

## find command in history
his() { history | grep "$1"; }

jr() { javac "$1" && java $(echo $1 | sed 's/.java//') $(echo "${@:2}"); }

# add numbers to non empty lines in a file
# usage: num <file>
num() { nl -s ' ' "$1" > tmp && mv tmp "$1" && sed "s/^[ \t]*//" -i "$1" && cat "$1" | xclip }

# make symbolic links
# if 1st arg is a dir, no "/" should be appended
# ln -s {FILE_PATH} {SYMLINK_PATH}
sym() { ln -s "$(pwd)/$1" "$2"; }
# example: cd $DOTFILES/ && sym .inputrc /home/riddle/
sym.dir() { ln -s "$(pwd)/$1" "$2/$1"; }
# example: cd $DOTFILES/.config && sym.dir smartgit /home/riddle/.config

# go to command's flag description in  manpage, ex. `manf grep -r`
manf () { man "$1" | less -p "^ +$2"; }

# returns "A" \ "B" (subtracting identical lines)
a_minus_b() { grep -Fvx -f "$2" "$1" | sort; }

# removes lines from file "A" which contain string from file "B"
a_minus_string_in_b() { grep -Fv -f "$2" "$1" | sort; }

# returns "A" & "B" (identical lines)
a_and_b() { comm -12 <( sort "$1" ) <( sort "$2" ) }

# returns "A" U "B" (union of lines, removes duplicate lines)
a_union_b() { cat "$1" "$2" | sort -u }

# find all files from current folder | prints extension of files if any | make a unique sorted list
ext() { find . -type f | perl -ne 'print $1 if m/\.([^.\/]+)$/' | sort -u; }

# copy arguments to clipboard
sel() { echo "$@" | xclip}

get-mp3() { youtube-dl --no-playlist --extract-audio --audio-format mp3 "$1"; }

yy() { name="${1%.asm}"; yasm "$name.asm" -fbin -o "$name.com"; }

# opens a temporary file with a given extension
# (default extension: .md)
# file is opened in /tmp dir, it's name contains a timestamp
temp() {
    ext="$1";
    [[ -z "$1" ]] && ext="md"
    vim "/tmp/temp_$(date +%F_%H_%M_%S).$ext";
}

open() {
    vim $(codid2file "$1")
}

# usage: fields <file>
fields () {
    awk -F"\t" '{print NF}' "$1" | uniq -c
}

# usage: fields <file>
fields-csv () {
    awk -F, '{print NF}' "$1" | uniq -c
}

# usage: cols <col_no> <file>
# $1 - col no
# $2 - file name
cols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort | uniq
}

# usage: cols <col_no> <file>
cols-csv () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F, -f <(echo "$col_no") "$2" | sort | uniq
}

# usage: cols <col_no> <file>
ncols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort -n | uniq
}

# usage: pcols <col_no> <file>
pcols () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | perl -e '@data = map {[split(/\t/,$_)]} <>; print map {join("\t",@$_)} sort {$a->[0] <=> $b->[0]} @data' | uniq
}

# convert epoch to human-readable date
# usage: epoch-to-date 1643294515
epoch-to-date () {
    date  -d @"$1" "+%F"
}

ddif() {
    meld \
        <( cat "$1" | (sed -u 1q; sort -k1 -n) ) \
        <( cat "$2" | (sed -u 1q; sort -k1 -n) ) \
}

minsec_to_hours() {
    bc -l <<<"$1/60 + $2/3600"
}
