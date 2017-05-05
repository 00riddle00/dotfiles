#! /bin/bash
export DOTFILES_DIR=/home/riddle/.riddle/.dotfiles

git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/cmd/.vim/bundle/Vundle.vim &&
vim +PluginInstall +qall
