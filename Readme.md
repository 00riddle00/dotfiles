#Install Vundle.vim:

git clone https://github.com/VundleVim/Vundle.vim.git dotfiles/.vim/bundle/Vundle.vim
vim dotfiles/.vimrc

# execute ex command in VIM:
:PluginInstall!

# copy the files from dotfiles folder to home directory then, if one wants to use the config dotfiles
cp -r dotfiles/.* ~/

