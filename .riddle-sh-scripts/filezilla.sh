#!/bin/sh

app="filezilla"

 
# no app started, so start one
if [ -z  "`wmctrl -lx | grep filezilla`" ]; then
    $app &
# app is opened, so focus on it
else
    wmctrl -a $app
fi;
