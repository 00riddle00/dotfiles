#! /bin/bash

for file in $DOTFILES_DIR/cmd/.[a-z]*; do
    if [[ "$file" =~ ".oh-my-zsh" ]]; then
        continue
    fi
    ln -sf $file $HOME/${file##*/}
done
