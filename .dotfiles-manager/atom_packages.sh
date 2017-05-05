#! /bin/bash
export DOTFILES_DIR=/home/riddle/.riddle/.dotfiles

while read p; do
    apm install $p
done < $DOTFILES_DIR/xorg/.atom/package_list
