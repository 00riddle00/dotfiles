#!/bin/sh

# file extension
ext="$1"; # example: png

# starting number
a=1

for i in *.$ext; do
  new=$(printf "%04d.$ext" "$a") #04 pad to length of 4
  mv -i -- "$i" "$new"
  let a=a+1
done

