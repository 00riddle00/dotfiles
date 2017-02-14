#! /bin/bash
rm -f $DOTFILES_DIR/.vim/bundle/.gitkeep &&
git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/.vim/bundle/Vundle.vim &&
touch $DOTFILES_DIR/.vim/bundle/.gitkeep
vim +PluginInstall +qall
