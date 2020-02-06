#!/usr/bin/env sh

usb_part=$(lsblk -f | grep USB | awk '{print $1}' | grep -P '[a-zA-Z0-9]\w+' -o)
sudo umount /media/usb
echo "usb unmounted gg"

