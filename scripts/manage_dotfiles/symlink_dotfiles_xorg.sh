#! /bin/bash

for entry in $DOTFILES_DIR/xorg/.[a-zA-Z]*; do
    [ -e "$entry" ] && [[ ${entry##*/} != ".config" ]] && ln -sf $entry $HOME/${entry##*/}
done

# mkdir -p $HOME/.config

for entry in $DOTFILES_DIR/xorg/.config/[a-zA-Z]*; do
    [ -e "$entry" ] && ln -sf $entry $HOME/.config/${entry##*/}
done

