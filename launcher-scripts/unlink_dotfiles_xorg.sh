#! /bin/bash

for file in $DOTFILES_DIR/xorg/.[a-z]*; do
    rm -rf $HOME/${file##*/}
done

