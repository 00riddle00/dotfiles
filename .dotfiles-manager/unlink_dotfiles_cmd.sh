#! /bin/bash

for file in $DOTFILES_DIR/cmd/.[a-z]*; do
    rm -rf $HOME/${file##*/}
done
