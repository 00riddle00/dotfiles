#!/bin/sh

obj="pycharm"
launch="pyc"

 
# no pycharm started, so start one
if [ -z  "`wmctrl -lx | grep pycharm`" ]; then
    ~/programs/pycharm-2016.3.1/bin/pycharm.sh &
    # eval pyc &
# pycharm is opened, so focus on it
else
    wmctrl -a pycharm
fi;
