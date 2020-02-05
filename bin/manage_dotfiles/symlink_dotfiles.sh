#! /bin/bash

for entry in $DOTFILES_DIR/.[a-zA-Z]*; do
    # whenever you iterate over files/folders by globbing, it's good practice to avoid the corner 
    # case where the glob does not match (which makes the loop variable expand to the 
    # (un-matching) glob pattern string itself), hence [ -e "$entry" ] is used
    [ -e "$entry" ] && 
        [[ ${entry##*/} != ".config" ]] &&
        # .gitconfig is also ignored. Will deal with that later
        [[ ${entry##*/} != .git* ]] &&
    ln -sf $entry $HOME/${entry##*/}
done

# mkdir -p $HOME/.config

for entry in $DOTFILES_DIR/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&
    ln -sf $entry $HOME/.config/${entry##*/}
done
