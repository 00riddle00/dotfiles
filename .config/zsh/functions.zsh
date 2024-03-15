# MAIN USER FUNCTIONS

## make a temp backup
bk() { cp "$1" "$1.bak"; }

## make an alias for zsh
## ex. usage (called from specific directory):
##      ma "vedit" "vim $(readlink -f file_to_edit.txt)"
##      ma "cddir" "cd $(pwd)"
ma() { echo alias "$1='$2'" >> "$ZDOTDIR/aliases.zsh"; echo "***Alias added***\nalias $1='$2'"; zsh }

## make an alias for zsh to cd into current dir.
macd() { echo alias "$1='cd $(pwd)'" >> "$ZDOTDIR/aliases.zsh"; echo "***Alias added***\nalias $1='cd $(pwd)'"; zsh }

# SYSTEMWIDE FUNCTIONS

## find command in history
his() { history | grep "$1"; }

jr() { javac "$1" && java $(echo $1 | sed 's/.java//') $(echo "${@:2}"); }

# add numbers to non empty lines in a file
# usage: num <file>
num() { nl -s ' ' "$1" > tmp && mv tmp "$1" && sed "s/^[ \t]*//" -i "$1" && cat "$1" | xclip }

# go to command's flag description in  manpage, ex. `manf grep -r`
manf () { man "$1" | less -p "^ +$2"; }

# returns "A" \ "B" (subtracting identical lines)
a_minus_b() { grep -Fvx -f "$2" "$1" | sort; }

# removes lines from file "A" which contain string from file "B"
a_minus_string_in_b() { grep -Fv -f "$2" "$1" | sort; }

a_and_string_in_b() { grep -F -f "$2" "$1" | sort; }

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
# $1 - col no
# $2 - file name
colss () {
    col_no="\$$1";
    col_no="{print $col_no}";
    awk -F$'\t' -f <(echo "$col_no") "$2" | sort
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
    echo "large dir"
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
