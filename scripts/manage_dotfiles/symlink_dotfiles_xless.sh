#! /bin/bash

for entry in $DOTFILES_DIR/xless/.[a-zA-Z]*; do
    # whenever you iterate over files/folders by globbing, it's good practice to avoid the corner 
    # case where the glob does not match (which makes the loop variable expand to the 
    # (un-matching) glob pattern string itself), hence [ -e "$entry" ] is used
    [ -e "$entry" ] && [[ ${entry##*/} != ".config" ]] && ln -sf $entry $HOME/${entry##*/}
done

# mkdir -p $HOME/.config

for entry in $DOTFILES_DIR/xless/.config/[a-zA-Z]*; do
    [ -e "$entry" ] && ln -sf $entry $HOME/.config/${entry##*/}
done

