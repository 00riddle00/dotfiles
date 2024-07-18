Last updated: `2024-07-17 11:08:21 EEST`

These cronjobs have components that require information about the current
display to show notifications correctly.

When adding them as cronjobs, it is recommended to precede the command with the
following:

```bash
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
export DISPLAY=:0
. $HOME/.zshenv
{{ COMMAND_GOES_HERE }}
```

This ensures that notifications will display
(`export DBUS_SESSION_BUS_ADDRESS=...`),
xdotool commands will function (`export DISPLAY=...`)
and environmental variables will work as well (`.$HOME/.zshenv`).
