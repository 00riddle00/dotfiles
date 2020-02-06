#! /bin/bash

for entry in $DOTFILES_DIR/.[a-zA-Z]*; do
    [ -e "$entry" ] && 
        [[ ${entry##*/} != ".config" ]] &&
        [[ ${entry##*/} != ".local" ]] &&
        # .gitconfig is also ignored. Will deal with that later
        [[ ${entry##*/} != .git* ]] &&
    # also check if it's symbolic link before deleting
    [ -L "$HOME/${entry##*/}" ] &&
    rm -rf $HOME/${entry##*/}
done

for entry in $DOTFILES_DIR/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$HOME/.config/${entry##*/}" ] && rm -rf $HOME/.config/${entry##*/}
done

# todo leave ~/.local/share/ folder as is
for entry in $DOTFILES_DIR/.local/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$HOME/.local/${entry##*/}" ] && rm -rf $HOME/.local/${entry##*/}
done
