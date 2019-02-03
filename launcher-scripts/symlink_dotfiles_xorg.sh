#! /bin/bash
for file in $DOTFILES_DIR/xorg/.[a-zA-Z]*; do
    ln -sf $file $HOME/${file##*/}
done
