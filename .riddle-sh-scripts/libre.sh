#!/bin/sh

libreoffice_open="libreoffice"
libreoffice_focus="libreoffice"

 
# no libreoffice started, so start one
if [ -z  "`wmctrl -lx | grep libreoffice`" ]; then
    $libreoffice_open &
# libreoffice is opened, so focus on it
else
    wmctrl -x -R $libreoffice_focus
fi;
