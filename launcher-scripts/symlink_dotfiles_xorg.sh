#! /bin/bash
for file in $DOTFILES_DIR/xorg/.[a-z]*; do
    ln -sf $file $HOME/${file##*/}
done
