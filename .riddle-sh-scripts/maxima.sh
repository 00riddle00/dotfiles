#!/bin/bash

app="wxmaxima"
app_focus="wmctrl -a $app"

 
# no libreoffice started, so start one
if [ -z  "`wmctrl -lx | grep $app`" ]; then
    $app &
# libreoffice is opened, so focus on it
else
    $app_focus
fi;
