#!/bin/sh

file=$(zenity --entry \
        --title "Create New File" \
	--text "Enter the new name:" \
	--entry-text ""); touch "$file"
