#! /bin/bash

export DOTFILES_DIR=/home/riddle/.riddle/.dotfiles

rm -rf $HOME/.oh-my-zsh && 
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" 

# You should execute this command after that: (since oh-my-zsh install recreates .zshrc file anew)
# ln -sf $DOTFILES_DIR/cmd/.zshrc $HOME/.zshrc
