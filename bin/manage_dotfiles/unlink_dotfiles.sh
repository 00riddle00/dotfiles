#!/usr/bin/env bash

source $HOME/.dotfiles/.zshenv

# $HOME dir
for entry in $DOTFILES_DIR/.[a-zA-Z]*; do
    [ -e "$entry" ] && 
        [[ ${entry##*/} != ".config" ]] &&
        [[ ${entry##*/} != ".local" ]] &&
        [[ ${entry##*/} != .git* ]] &&
    # also check if it's symbolic link before deleting
    [ -L "$HOME/${entry##*/}" ] &&
    rm -rf $HOME/${entry##*/}
done

# $XDG_CONFIG_HOME dir
for entry in $DOTFILES_DIR/.config/[a-zA-Z]*; do
    [ -e "$entry" ] &&  [ -L "$XDG_CONFIG_HOME/${entry##*/}" ] && rm -rf $XDG_CONFIG_HOME/${entry##*/}
done

# $XDG_DATA_HOME dir
local_bin="$DOTFILES_DIR/.local/bin"
[ -e "$local_bin" ] &&  [ -L "$HOME/.local/${local_bin##*/}" ] && rm -rf $HOME/.local/${local_bin##*/}

local_shared="$DOTFILES_DIR/.local/share/riddle00"
[ -e "$local_shared" ] &&  [ -L "$XDG_DATA_HOME/${local_shared##*/}" ] && rm -rf $XDG_DATA_HOME/${local_shared##*/}

for entry in $DOTFILES_DIR/.local/share/applications/[a-zA-Z]*; do
    [ -e "$entry" ] &&
    [ -L "$XDG_DATA_HOME/applications/${entry##*/}" ] &&
    rm -rf $XDG_DATA_HOME/applications/${entry##*/}
done
