#! /bin/bash

while read p; do
    apm install $p
done < $DOTFILES_DIR/packages/atom_packages

