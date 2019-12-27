#! /bin/bash

for file in $DOTFILES_DIR/xorg/.[a-zA-Z]*; do
    rm -rf $HOME/${file##*/}
done

