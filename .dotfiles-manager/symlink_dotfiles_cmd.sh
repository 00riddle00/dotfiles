#! /bin/bash
export DOTFILES_DIR=/home/riddle/.riddle/.dotfiles

ln -sf $DOTFILES_DIR/cmd/.aliases $HOME/.aliases
ln -sf $DOTFILES_DIR/cmd/.bashrc $HOME/.bashrc
ln -sf $DOTFILES_DIR/cmd/.dircolors $HOME/.dircolors 
ln -sf $DOTFILES_DIR/cmd/.emacs $HOME/.emacs
ln -sf $DOTFILES_DIR/cmd/.gitconfig $HOME/.gitconfig 
ln -sf $DOTFILES_DIR/cmd/.gntrc $HOME/.gntrc
ln -sf $DOTFILES_DIR/cmd/.gtkrc-2.0 $HOME/.gtkrc-2.0
ln -sf $DOTFILES_DIR/cmd/.gtkrc-2.0.mine $HOME/.gtkrc-2.0.mine
ln -sf $DOTFILES_DIR/cmd/.irssi $HOME/.irssi
ln -sf $DOTFILES_DIR/cmd/.lessfilter $HOME/.lessfilter
ln -sf $DOTFILES_DIR/cmd/.mutt $HOME/.mutt
#ln -sf $DOTFILES_DIR/cmd/.oh-my-zsh $HOME/.oh-my-zsh
ln -sf $DOTFILES_DIR/cmd/.tmux $HOME/.tmux
ln -sf $DOTFILES_DIR/cmd/.tmux.conf $HOME/.tmux.conf 
ln -sf $DOTFILES_DIR/cmd/.vim $HOME/.vim
ln -sf $DOTFILES_DIR/cmd/.vimrc $HOME/.vimrc
ln -sf $DOTFILES_DIR/cmd/.xinitrc $HOME/.xinitrc 
ln -sf $DOTFILES_DIR/cmd/.zshrc $HOME/.zshrc 
