#! /bin/bash
for file in $DOTFILES_DIR/xorg/.[a-zA-Z]*; do
     #[[ -f $file ]] && ln -sf $file $HOME/${file##*/}
     ln -sf $file $HOME/${file##*/}
done

#for entry in $DOTFILES_DIR/xorg/.config/[a-zA-Z]*; do
     #ln -sf $entry $HOME/.config/${entry##*/}
#done

