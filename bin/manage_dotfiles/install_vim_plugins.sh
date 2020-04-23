#!/usr/bin/env sh

source $HOME/.dotfiles/.zshenv

apps=(
    "cmake"
    "git"
    "python"
    "zsh"
)

for app in "${apps[@]}"; do
    res=$(pacman -Qqe | grep -E "(^|\s)$app($|\s)");

    if [ -z "$res" ]; then
        sudo pacman -S --noconfirm $app
    fi
done

git clone https://github.com/VundleVim/Vundle.vim.git $DOTFILES_DIR/.vim/bundle/Vundle.vim &&
vim +PluginInstall +qall &&
python ~/.vim/bundle/YouCompleteMe/install.py
