#!/usr/bin/env sh
# if any package is not found, does not install anything from the list
# if package is already installed, skips it (shows up-to date message)

sudo pacman -S --noconfirm --needed - < packages_main_repos
