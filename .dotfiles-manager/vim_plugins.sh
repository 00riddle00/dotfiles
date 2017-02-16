#! /bin/bash
rm -f $DOTFILES_DIR/cmd/.vim/bundle/.gitkeep &&
git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/cmd/.vim/bundle/Vundle.vim &&
touch $DOTFILES_DIR/cmd/.vim/bundle/.gitkeep
vim +PluginInstall +qall
