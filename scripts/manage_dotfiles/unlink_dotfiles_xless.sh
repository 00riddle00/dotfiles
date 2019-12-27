#! /bin/bash

for file in $DOTFILES_DIR/xless/.[a-zA-Z]*; do
    rm -rf $HOME/${file##*/}
done
