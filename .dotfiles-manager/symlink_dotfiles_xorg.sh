#! /bin/bash
export DOTFILES_DIR=$HOME/.riddle/.dotfiles

ln -sf $DOTFILES_DIR/xorg/.config $HOME/.config
ln -sf $DOTFILES_DIR/xorg/.conky   $HOME/.conky
ln -sf $DOTFILES_DIR/xorg/.gmrunrc        $HOME/.gmrunrc
ln -sf $DOTFILES_DIR/xorg/.gtkrc-2.0  $HOME/.gtkrc-2.0
ln -sf $DOTFILES_DIR/xorg/.inputrc       $HOME/.inputrc
ln -sf $DOTFILES_DIR/xorg/.i3   $HOME/.i3
ln -sf $DOTFILES_DIR/xorg/.local   $HOME/.local
