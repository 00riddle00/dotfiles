#!/usr/bin/env sh
# if a package is not found, skips it
# if a package is already installed, skips it  as well

yay -Syu --aur --noconfirm - < packages_aur
