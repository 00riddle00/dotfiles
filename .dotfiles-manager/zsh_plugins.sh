#! /bin/bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" &&
rm -f $DOTFILES_DIR/cmd/.oh-my-zsh/.gitkeep &&
#mv $HOME/.oh-my-zsh/ $DOTFILES_DIR/cmd/ &&
ln -sf $DOTFILES_DIR/cmd/.oh-my-zsh $HOME/.oh-my-zsh &&
ln -sf $DOTFILES_DIR/cmd/.zshrc $HOME/.zshrc
