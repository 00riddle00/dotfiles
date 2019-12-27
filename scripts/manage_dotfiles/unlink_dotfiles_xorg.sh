#! /bin/bash

for entry in $DOTFILES_DIR/xorg/.[a-zA-Z]*; do
    [ -e "$entry" ] && [[ ${entry##*/} != ".config" ]] && [ -L "$HOME/${entry##*/}" ] && rm -rf $HOME/${entry##*/}
done

for entry in $DOTFILES_DIR/xorg/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$HOME/.config/${entry##*/}" ] && rm -rf $HOME/.config/${entry##*/}
done

