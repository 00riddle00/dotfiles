#! /bin/bash

while read p; do
    sudo npm install -g $p
done < $DOTFILES_DIR/packages/npm_packages
