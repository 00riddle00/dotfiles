#! /bin/bash

for file in $DOTFILES_DIR/xless/.[a-zA-Z]*; do
    #[[ -f $file ]] && ln -sf $file $HOME/${file##*/}
    ln -sf $file $HOME/${file##*/}
done

#for entry in $DOTFILES_DIR/xless/.config/[a-zA-Z]*; do
     #ln -sf $entry $HOME/.config/${entry##*/}
#done

