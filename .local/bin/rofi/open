#!/usr/bin/env bash

if [ ! -z "$@" ]
then
    app="$1"

    # no app is running, so start one
    if [ -z  "`wmctrl -lx | grep -i $app`" ]; then
        coproc ($app > /dev/null 2>&1)
        exec 1>&-
        exit;
    else
        # app is opened, so focus on it
        wmctrl -x -R $app
    fi
fi
