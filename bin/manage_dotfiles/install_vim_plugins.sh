#!/usr/bin/env sh

git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/.vim/bundle/Vundle.vim &&
vim +PluginInstall +qall &&
python ~/.vim/bundle/YouCompleteMe/install.py

