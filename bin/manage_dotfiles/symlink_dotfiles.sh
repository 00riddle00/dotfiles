#!/usr/bin/env bash

if [ ! -d $HOME/.config ]; then
      mkdir -p $HOME/.config;
fi

if [ ! -d $HOME/.local/share/applications ]; then
      mkdir -p $HOME/.local/share/applications;
fi

# $HOME dir
for entry in $DOTFILES_DIR/.[a-zA-Z]*; do
    # whenever you iterate over files/folders by globbing, it's good practice to avoid the corner 
    # case where the glob does not match (which makes the loop variable expand to the 
    # (un-matching) glob pattern string itself), hence [ -e "$entry" ] is used
    [ -e "$entry" ] && 
        [[ ${entry##*/} != ".config" ]] &&
        [[ ${entry##*/} != ".local" ]] &&
        [[ ${entry##*/} != .git* ]] &&
    ln -sf $entry $HOME/${entry##*/}
done

# $XDG_CONFIG_HOME dir
for entry in $DOTFILES_DIR/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&
    ln -sf $entry $XDG_CONFIG_HOME/${entry##*/}
done

# $XDG_DATA_HOME dir
local_bin="$DOTFILES_DIR/.local/bin"
[ -e "$local_bin" ] && ln -sf $local_bin $HOME/.local/bin

local_shared="$DOTFILES_DIR/.local/share/riddle00"
[ -e "$local_shared" ] && ln -sf $local_shared $XDG_DATA_HOME/riddle00

for entry in $DOTFILES_DIR/.local/share/applications/[a-zA-Z]*; do
    [ -e "$entry" ] &&
    ln -sf $entry $XDG_DATA_HOME/applications/${entry##*/}
done
