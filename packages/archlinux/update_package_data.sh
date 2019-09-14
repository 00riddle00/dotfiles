#!/bin/bash

pacman -Qqm > packages_aur
pacman -Qqe > pacman.lst
# palieka tik tas eilutes, kurios nematchina su pattern_file (packages_aur)
grep -Fvx -f packages_aur pacman.lst > packages_main_repos
rm pacman.lst
