#!/usr/bin/env sh

# A script to test whether a laptop is charging
cmd="upower -i `upower -e | grep 'BAT'` > /dev/null 2>&1"

if $cmd | grep -i "state" | grep -i "dis" > /dev/null 2>&1; then
    echo "-----"
    espeak "Your laptop needs a charger" > /dev/null 2>&1
else
    echo "+++++"
    espeak "Your laptop is charging" > /dev/null 2>&1
fi
acpi
