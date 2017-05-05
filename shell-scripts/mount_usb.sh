#! /bin/sh

#TODO add debug code

usb_part=$(lsblk -f | grep USB | awk '{print $1}' | grep -P '[a-zA-Z0-9]\w+' -o)

#print
#echo $usb_part

sudo mount /dev/$usb_part /media/usb

echo "usb mounted gg"



