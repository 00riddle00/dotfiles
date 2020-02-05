#! /bin/bash

for entry in $DOTFILES_DIR/xless/.[a-zA-Z]*; do
    # also check if it's symbolic link before deleting
    [ -e "$entry" ] && [[ ${entry##*/} != ".config" ]] && [ -L "$HOME/${entry##*/}" ] && rm -rf $HOME/${entry##*/}
done

for entry in $DOTFILES_DIR/xless/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$HOME/.config/${entry##*/}" ] && rm -rf $HOME/.config/${entry##*/}
done
