#! /bin/sh

for pkg in yay; do
    git clone https://aur.archlinux.org/$pkg.git &&
    cd $pkg && makepkg --noconfirm -si &&
    cd - && sudo rm -dR $pkg 
done

