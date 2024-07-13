Last updated: `2024-04-08 15:55:52 EEST`

These cronjobs have components that require information about your current
display to display notifications correctly.

When you add them as cronjobs, I recommend you precede the command with
commands as those below:

```
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
export DISPLAY=:0
. $HOME/.zshenv
{{ COMMAND_GOES_HERE }}
```

This ensures that notifications will display 
(`export DBUS_SESSION_BUS_ADDRESS=...`), 
xdotool commands will function (`export DISPLAY=...`) 
and environmental variables will work as well (`.$HOME/.zshenv`).
