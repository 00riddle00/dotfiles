#! /bin/bash

git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/cmd/.vim/bundle/Vundle.vim &&
vim +PluginInstall +qall
