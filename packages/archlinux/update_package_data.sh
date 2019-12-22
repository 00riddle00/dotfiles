#!/bin/bash

pacman -Qqm > packages_aur
pacman -Qqe > pacman.lst
# leaves only those rows which do not exist in "packages_aur" file
grep -Fvx -f packages_aur pacman.lst > packages_main_repos
rm pacman.lst
