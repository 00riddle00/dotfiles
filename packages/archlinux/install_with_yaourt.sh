#! /bin/sh

while read p; do
    yaourt -Syu --aur --noconfirm $p
done < packages_aur

