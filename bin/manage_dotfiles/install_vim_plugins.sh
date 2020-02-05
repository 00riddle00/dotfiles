#! /bin/bash

git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/xless/.vim/bundle/Vundle.vim &&
vim +PluginInstall +qall
