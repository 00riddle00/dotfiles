#! /bin/sh

for pkg in package-query yaourt; do
    git clone https://aur.archlinux.org/$pkg.git &&
    cd $pkg && makepkg --noconfirm -si &&
    cd - && sudo rm -dR $pkg 
done

