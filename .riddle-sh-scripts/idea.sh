#!/bin/sh

# no pycharm started, so start one
if [ -z  "`wmctrl -lx | grep IDEA`" ]; then
    ~/programs/idea-IU-163.9166.29/bin/idea.sh &

    # eval pyc &
# pycharm is opened, so focus on it
else
    wmctrl -a IDEA
fi;
