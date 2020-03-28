#!/usr/bin/env bash

for entry in $DOTFILES_DIR/.[a-zA-Z]*; do
    [ -e "$entry" ] && 
        [[ ${entry##*/} != ".config" ]] &&
        [[ ${entry##*/} != ".local" ]] &&
        # .gitconfig is also ignored. Will deal with that later
        [[ ${entry##*/} != .git* ]] &&
    # also check if it's symbolic link before deleting
    [ -L "$HOME/${entry##*/}" ] &&
    rm -rf $HOME/${entry##*/}
done

for entry in $DOTFILES_DIR/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$HOME/.config/${entry##*/}" ] && rm -rf $HOME/.config/${entry##*/}
done

local_bin="$DOTFILES_DIR/.local/bin"
[ -e "$local_bin" ] &&  [ -L "$HOME/.local/${local_bin##*/}" ] && rm -rf $HOME/.local/${local_bin##*/}

local_shared="$DOTFILES_DIR/.local/share/riddle00"
[ -e "$local_shared" ] &&  [ -L "$HOME/.local/share/${local_shared##*/}" ] && rm -rf $HOME/.local/share/${local_shared##*/}

