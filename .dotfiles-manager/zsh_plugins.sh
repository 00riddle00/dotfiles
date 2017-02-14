#! /bin/bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" &&
rm -f $DOTFILES_DIR/.oh-my-zsh/.gitkeep &&
#mv $HOME/.oh-my-zsh/ $DOTFILES_DIR/ &&
ln -sf $DOTFILES_DIR/.oh-my-zsh $HOME/.oh-my-zsh &&
ln -sf $DOTFILES_DIR/.zshrc $HOME/.zshrc
