#! /bin/bash

while read p; do
    apm install $p
done < $DOTFILES_DIR/xorg/.atom/package_list
