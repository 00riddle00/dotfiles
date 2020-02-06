#! /bin/sh
# if any package is not found, skips it
# if package is already installed, skips it 

yay -Syu --aur --noconfirm - < packages_aur
