#! /bin/bash

for entry in $DOTFILES_DIR/.[a-zA-Z]*; do
    [ -e "$entry" ] && 
        [[ ${entry##*/} != ".config" ]] &&
        # .gitconfig is also ignored. Will deal with that later
        [[ ${entry##*/} != .git* ]] &&
    # also check if it's symbolic link before deleting
    [ -L "$HOME/${entry##*/}" ] &&
    rm -rf $HOME/${entry##*/}
done

for entry in $DOTFILES_DIR/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$HOME/.config/${entry##*/}" ] && rm -rf $HOME/.config/${entry##*/}
done
