# vim:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2025-05-04 23:23:37 EEST
# Path:   ~/.config/zsh/aliases.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
#
# Table of contents
# -----------------
#   1. Navigation
#   2. Getting information
#   3. Standard commands
#   4. Modifying shell behavior
#   5. Permissions
#   6. Clipboard
#   7. Fonts
#   8. Keyboard layouts
#   9. Screen brightness
#  10. Sound
#  11. Clock and time
#  12. Systemd
#  13. Network
#  14. WPA Supplicant
#  15. Mount/Unmount
#  16. Process Management
#  17. Package management
#  18. ABS (Arch Build System)
#  19. Programs
#  20. Configs
#  21. Window manager-specific
#  22. Aliases to Zsh functions
#  23. Aliases to scripts
#  24. Aliases as flags
#  25. Programming
#  26. Misc
#  27. Temporary

alas() {
  builtin alias -- ${1}="${2}"
}

#------------------------------------------------------------------------------
# 1. Navigation
#------------------------------------------------------------------------------

# Going up ('c' is a custom Shell function)
#alias up    'c ..'
alas ./    'c ..'
alas ..    'c ..'
alas ...   'c ../..'
alas ....  'c ../../..'
alas ..... 'c ../../../..'
alas -     'c "${OLDPWD}"'
alas c-    'c "${OLDPWD}"'

#alias cd 'echo "*** Use '\'"c"\'' ***"'
alas ls   'echo "*** Use '\'"l"\'' ***"'
alas cat  'echo "*** Use '\'"ca"\'' ***"'
alas exit 'echo "*** Use '\'"q"\'' ***"'

# Temporary directories
alas mp  'c ${MP} '
alas mp1 'c ${MP1}'
alas mp2 'c ${MP2}'
alas mp3 'c ${MP3}'
alas mp4 'c ${MP4}'
alas mp5 'c ${MP5}'
alas mp6 'c ${MP6}'
alas mp7 'c ${MP7}'
alas mp8 'c ${MP8}'
alas mp0 'c ${MP0}'

# Various locations
alas bak      'c ${HOME}/backups'
alas bin      'c ${BIN}'
alas cache    'c ${XDG_CACHE_HOME}'
alas can      'c ${CANDY}'
alas conf     'c ${XDG_CONFIG_HOME}'
alas drop     'c ${DROPBOX}'
alas drop.bak 'c ${DROPBOX}/backups'
alas dw       'c ${XDG_DOWNLOAD_DIR}'
alas hist     'c ${HOME}/histfiles/'
alas lok      'c ${HOME}/.local'
alas share    'c ${XDG_DATA_HOME}'
alas data     'c ${XDG_DATA_HOME}'
alas dat      'c ${XDG_DATA_HOME}'
alas dots     'c ${DOTSHARE}'
alas notes    'c ${NOTES}'
#alas n        'c ${NOTES}'
alas op       'c ${XDG_CONFIG_HOME}/openbox'
alas pro      'c ${PRO}'
alas np       'c ${PRO}/archived/2022/npBuild'
alas sol      'c ${PRO}/archived/2023/Solutions-To-Problems/Codewars'
alas tem      'c ${PRO}/archived/2023/Solutions-To-Problems/Codewars/temp'
alas res      'c ${XDG_DATA_HOME}/tmux/resurrect'
alas sk       'c ${SCREENSHOTS}'
alas we       'c ${MP1}/webuzz && venv'
alas bu       'c ${MP1}/budget && venv'
alas vid      'c ${XDG_VIDEOS_DIR}'
alas was      'c ${HOME}/wastebasket'
alas ws       'c ${HOME}/wastebasket'
alas zdot     'c ${ZDOTDIR}'
alas home     'c'

#------------------------------------------------------------------------------
# 2. Getting information
#------------------------------------------------------------------------------

# Hostname and path
alas host 'echo ${HOST}'
alas path 'echo ${PATH} | tr ":" "\n"'

# Disk info
alas fl 'sudo fdisk -l'
alas lf 'lsblk -f'

# Video info
alas gpu.load   'watch -n 1 nvidia-smi'
alas gpu.which  'glxinfo | rg "OpenGL vendor|OpenGL renderer"'
alas info.video 'lspci | rg -e VGA -e 3D'

# Window info
alas get.win_class    'xprop | rg -i class'
alas get.win_pos_size 'xwininfo'
alas getpos           'xwininfo -id $(xdotool getactivewindow)'

# Keyboard keys info
alas get.key_code_1 'sed -n l'
alas get.key_code_2 'showkey --ascii'
alas get.keyname    'xev'
# ^--press keys and Enter (`cat` also can be used)

#------------------------------------------------------------------------------
# 3. Standard commands
#------------------------------------------------------------------------------

#alias c     'cat'
alas x     'clear'
alas cls   'clear'
alas q     '\exit'
#alias h     'history'
#alias j     'jobs'
#alias j     'journalctl -xe'
#alias cp    'cp -i'
#alias mv    'mv -i'
alas more  'less'
#alas m     'less'
alas re    'reboot'
alas off   'poweroff'
alas prego 'sudo $(fc -ln -1)'
alas cpr   'cp -r'
alas rmr   'rm -rf'
alas rmrf  'sudo rm -r'

#------------------------------------------------------------------------------
# 4. Modifying shell behavior
#------------------------------------------------------------------------------

alas show_hidden 'setopt -s glob_dots'

#------------------------------------------------------------------------------
# 5. Permissions
#------------------------------------------------------------------------------

alas exe   'chmod +x'
alas ex    'chmod +x'
alas noexe 'chmod -x'
alas noex  'chmod -x'
alas let   'chmod 755'
alas letr  'chmod -R 755'
alas ch    'sudo chown -R ${USER}:${USER}'

#------------------------------------------------------------------------------
# 6. Clipboard
#------------------------------------------------------------------------------

alas copy       'xclip -selection clipboard'
alas ll         'xclip -selection clipboard'
alas xclip.clip 'xclip -selection clipboard'
alas xclip.prim 'xclip -selection primary'
alas xclip.sec  'xclip -selection secondary'

#------------------------------------------------------------------------------
# 7. Fonts
#------------------------------------------------------------------------------

alas fonts.current 'fc-match --verbose Sans'
alas fonts.list    "fc-list ':' file"
alas fonts.find    'fc-list | rg -i'
alas fonts.match   'fc-match'
alas fonts.update  'fc-cache -fv'

#------------------------------------------------------------------------------
# 8. Keyboard layouts
#------------------------------------------------------------------------------
#
alas lt           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt'
# ^-- Choosing 'lt' also resets languages to the usual 'us,lt' combination
alas de           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,de'
alas es           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,es'
#alas he           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il'
alas ru           "setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle -layout 'us,lt,ru' -variant ',,phonetic'"
alas emacs.caps   'setxkbmap -option && set-keyboard-layout'
alas emacs.nocaps 'setxkbmap -option ctrl:nocaps'
alas nocaps       'sudo dumpkeys | sed "s/\s*58\s*=\s*Caps_Lock/ 58 = Control/" | sudo loadkeys'

#------------------------------------------------------------------------------
# 9. Screen brightness
#------------------------------------------------------------------------------

alas xminus 'light -U 10'
alas xplus  'light -A 10'

#------------------------------------------------------------------------------
# 10. Sound
#------------------------------------------------------------------------------

alas aminus 'amixer set Master 10%-'
alas aplus  'amixer set Master 10%+'
alas mute   'amixer -q sset Master toggle'

#------------------------------------------------------------------------------
# 11. Clock and time
#------------------------------------------------------------------------------

alas clock.sync      'sudo ntpd -qg'
alas timezone.update 'timedatectl set-timezone "$(curl --fail https://ipapi.co/timezone)"'

#------------------------------------------------------------------------------
# 12. Systemd
#------------------------------------------------------------------------------

# General
alas systemd.boot       'systemd-analyze blame'
alas systemd.boot_total 'systemd-analyze time'
alas systemd.enabled    'systemctl list-unit-files | rg enabled'
alas systemd.enabled.2  'find /etc/systemd -type l -exec test -f {} \; -print | awk -F'\''/'\'' '\''{ printf ("%-40s | %s\n", $(NF-0), $(NF-1)) }'\'' | sort -f'
# ^--- Kudos to seth! (https://bbs.archlinux.org/profile.php?id=63451)
alas systemd.list       'systemctl list-unit-files'
alas systemd.running    'systemctl --type=service'

# Databases
alas most 'systemctl start mongodb'
alas myst 'systemctl start mysqld'
alas post 'systemctl start postgresql'

# Servers
alas apache   'systemctl start httpd.service'
alas reapache 'systemctl restart httpd'

# Wired
alas net     "systemctl start dhcpcd@$(basename -a /sys/class/net/enp*).service"
alas renet   "systemctl restart dhcpcd@$(basename -a /sys/class/net/enp*).service"
alas lan.on  "sudo ip link set $(basename -a /sys/class/net/enp*) up"
alas lan.off "sudo ip link set $(basename -a /sys/class/net/enp*) down"

# Wireless
alas wnet     "systemctl start dhcpcd@$(basename -a /sys/class/net/wlp*).service"
alas rewnet   "systemctl restart dhcpcd@$(basename -a /sys/class/net/wlp*).service"
alas wifi.on  "sudo ip link set $(basename -a /sys/class/net/wlp*) up"
alas wifi.off "sudo ip link set $(basename -a /sys/class/net/wlp*) down"

#------------------------------------------------------------------------------
# 13. Network
#------------------------------------------------------------------------------

alas pp                'ping -c 3 www.google.com'
alas pwp               'watch -n 0.5 "ping -c 3 www.google.com"'
alas check.ip          'whois'
alas check.dns         'nslookup'
alas check.domain      'whois'
alas get.my_ip         'curl -w "\n" ifconfig.me'
alas get.local_ip      'ip route --color=always | head -n 1'
alas get.gateway       'ip route --color=always | head -n 1'
alas get.net_interface 'ip route --color=always | head -n 1'  # Get the current active interface name

#------------------------------------------------------------------------------
# 14. WPA Supplicant
#------------------------------------------------------------------------------

alas wpa.android  "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/android.conf"
alas wpa.caffeine "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/caffeine.conf"
alas wpa.comet    "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/comet.conf"
alas wpa.home     "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/home.conf"
alas wpa.huracan  "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/huracan.conf"
alas wpa.iphone   "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/iphone.conf"
alas wpa.sodas    "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/sodas.conf"
alas wpa.wpa      "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/wpa_supplicant.conf"

#------------------------------------------------------------------------------
# 15. Mount/Unmount
#------------------------------------------------------------------------------

alas phone.on  'simple-mtpfs ${HOME}/iPhone'  # If problems, remount + restart thunar
alas phone.off 'umount ${HOME}/iPhone'

#------------------------------------------------------------------------------
# 16. Process Management
#------------------------------------------------------------------------------

alas kil 'kill -9'

# `ps -e` displays every active process on a Linux system in Unix format
alas ae 'ps -e | rg -v " rg$" | rg -i'
#     Use `ps c -ef` for a simple name of executable (as well as showing process status)

# '-f' performs a full-format listing
alas aef 'ps -ef | rg -v "[[:space:]]rg( |$)" | tee >(head -n1) | rg -i'

# Another way of listing (shows session id)
alas aes "ps -e -o user,pid,pgid,sess,args | rg -v '[[:space:]]rg( |$)' | tee >(head -n1) | rg -i"

# Display all processes in BSD format
#     'a' option displays the processes belonging to every user
#     'x' option tells ps to show all the processes regardless of
#         what terminal (if any) they are controlled ('?" in TTY column indicated
#         no controlling terminal)
alas au 'ps ax | rg -v "^[ ]*[0-9]+.* rg( |$)" | rg -i'
#     Use `ps cax` for a simple name of executable (as well as showing process status)

#     'u' option is for user-oriented format
alas aux "ps aux | rg -v '\brg\b' | rg -i"

# Also show parent PID
alas aup 'ps ax l | rg -v "^[ ]*[0-9]+.* rg( |$)" | rg -i'

# Show sleeping processes
alas asleep 'ps ax | rg -v "^[ ]*[0-9]+.* rg( |$)" | rg -- sleep'

# fuser -v {file/socket name(s)} - show info about process, working with the file(s)/socket(s)
alas fuserv 'fuser -v'

# fuser -vk {file/socket name(s)} - kill the process working with the file(s)/socket(s)
# E.g. usage: fuser -vk *.log
alas fuserk 'fuser -vk'

#------------------------------------------------------------------------------
# 17. Package management
#------------------------------------------------------------------------------

#---------------------------------------
# npm
#---------------------------------------

alas npm.ls   'npm list --depth=0'
alas npm.ls.g 'npm list -g --depth=0'

#---------------------------------------
# Pacman
#---------------------------------------

#------------------
# -Q flag
#------------------

alas orphans             'pacman -Qdtq'
alas is                  'pacman -Qeq | grepi '                     # Grep for explicitly installed package (package 'is' in the system)
alas isa                 'pacman -Qq | grepi '                      # Grep for installed package ('isa' = 'is -a' as in 'ls -a', with 'implicitly installed packages' as 'hidden files')
alas visa                'pacman -Q --color=always | grepi '        # Grep for installed package with version info ('visa' = 'is -a -v')
alas pl                  'pacman -Qeq'                              # List explicitly installed packages
alas ple                 'pacman -Qeq'                              # ------||------
alas ple_no_aur          'a_minus_b <(ple) <(plm)'                  # List explicitly installed packages (without showing AUR packages)
alas pla                 'pacman -Qq'                               # List all installed packages
alas pld                 'pacman -Qdq'                              # List packages dependencies
alas plm                 'pacman -Qmq | sort'                       # List foreign packages (mainly from AUR) (pacman lists packages in a different way than "sort" command!)
alas pac.owner           'pacman -Qo'                               # Which package owns the specified file(s)
alas pac.group           'pacman -Qgq'                              # List installed packages belonging to a group (or list all groups and packages if no argument is passed)
alas pac.group.belongs   'pacman -Qgq | grepi'                      # Show which group the installed package belongs to
alas pac.base            'a_and_b <(pac.base_remote) <(pla)'        # List installed packages depending on `base` metapackage
alas pac.base-devel      'a_and_b <(pac.base-devel_remote) <(pla)'  # List installed packages depending on `base-devel` metapackage
alas pac.info            'pacman -Qi'                               # Display info on a given installed package
alas pac.search          'pacman -Qs'                               # Search each installed package for names or descriptions that match regexp
alas pac.check_files     'pacman -Qk'                               # For all installed pkgs, check that all files owned by the given package(s) are present on the system.
alas pac.check_files_det 'pacman -Qkk'                              # More detailed checking (+ permissions, file sizes, and modification times) for pkgs that contain the needed mtree file.

#------------------
# -R flag
#------------------

alas pacr         'sudo pacman -Rns'
alas freeorphans  'sudo pacman -Rns $(pacman -Qdtq)'
alas free         'sudo pacman -Rns $(pacman -Qdtq)'
# Avoid using the -d option with pacman. pacman -Rdd package skips dependency checks during package removal.
# As a result, a package providing a critical dependency could be removed, resulting in a broken system.
alas pac.forcedel 'sudo -k pacman -Rdd'

#------------------
# -S flag
#------------------

alas pacfile               'sudo pacman -S --noconfirm - --needed <'      # Install from file
alas pacs                  'sudo pacman -S --noconfirm --needed'          # `needed` does not reinstall targets that are up to date
alas pac.group_remote      'pacman -Sgq'                                  # List packages from sync database belonging to a group
alas pac.base_remote       'expac -S '%E' base | xargs -n1 | sort'        # List packages from sync database depending on `base` metapackage
alas pac.base-devel_remote 'expac -S '%E' base-devel | xargs -n1 | sort'  # List packages from sync database depending on `base-devel` metapackage
alas pac.info_remote       'pacman -Si'                                   # Display info on a given sync database package
alas pac.info_remote_full  'pacman -Sii'                                  # ^--- and also display those packages in all repos that depend on this package.
alas pac.search_remote     'pacman -Ss'                                   # Search each package from sync database for names or descriptions that match regexp
# Removes uninstalled packages from /var/cache/pacman/pkg and cleans unused
# repos in /var/lib/pacman
alas pac.clear             'sudo pacman -Sc'
# Removes ALL packages from /var/cache/pacman/pkg and ...
alas pac.clear_all         'sudo pacman -Scc'
# Fuzzy-search through all available packages, with package info shown in a preview window, and then install selected packages
alas fzf.pac               'pacman -Slq | fzf -m --preview 'pacman -Si {1}' | xargs -ro sudo pacman -S'
# -------------------------------------------------------------------------
# Updates the pkg databases if the repositories haven’t been checked
# recently, and upgrades any new package versions.
# -y -> update
# -u -> upgrade
alas up                    'sudo pacman -Syu'
# Forces updates of the databases for all repositories (even if it
# was just updated recently) and upgrades any new package versions.
alas up1                   'sudo pacman -Syyu'
#  Upgrades packages and also downgrades packages (if one happens to have a
#  newer version than in the repository). Normally this should not be used.
#  Only if one is trying to fix a specific issue due to a new package being
#  removed from the repository.
alas up2                   'sudo pacman -Syuu'
# -------------------------------------------------------------------------

#---------------------------------------
# Paru
#---------------------------------------

alas paru      'paru --bottomup'
alas parus     'paru -S'  # Install a package from AUR
alas paru.info 'paru -Si' # Display info on a given installed package
alas parug     'paru -G'  # Download PKGBUILD and other files for a package
# Fuzzy-search through the AUR, preview info and install selected packages
alas fzf.paru  'paru -Slq | fzf -m --preview "paru -Si {1}" | xargs -ro paru -S --noconfirm'

#---------------------------------------
# PIP
#---------------------------------------

alas pii   'pip install'
alas pipir 'pip uninstall'
alas pir   'pip install -r requirements.txt'
alas piu   'pip install --upgrade pip'
alas wpi   'which pip'

#------------------------------------------------------------------------------
# 18. ABS (Arch Build System)
#------------------------------------------------------------------------------
alas mpo  'makepkg -o'      # --nobuild (only extract sources, don't build yet)
alas mpe  'makepkg -e'      # --noextract (reuse the extracted sources, so the changes stay in place)
alas mps  'makepkg -s'      # --syncdeps
alas mpi  'makepkg -si'     # --install
alas mpic 'makepkg -sic'    # --clean
alas pacu 'sudo pacman -U'  # Argument: pkgname-pkgver.pkg.tar.zst

#------------------------------------------------------------------------------
# 19. Programs
#------------------------------------------------------------------------------

#--------------------------------------
# Launching programs
#--------------------------------------

# Adhering to XDG BASE DIR spec:
alas dosbox 'dosbox -conf "${XDG_CONFIG_HOME}/dosbox/dosbox.conf"'
alas irssi  'irssi --config="${XDG_CONFIG_HOME}/irssi/config" --home="${XDG_CONFIG_HOME}/irssi"'
alas lynx   'lynx -lss="${XDG_CONFIG_HOME}/lynx/lynx.lss"'
#alias svn    'svn --config-dir "${XDG_CONFIG_HOME}/subversion"'

alas bs     'basename'
alas bl     'bluetoothctl'
alas ca     'bat'
alas e      'echo'
alas enc    'uchardet'
alas espeak 'espeak -ven-uk'
#alias f      'fzf'
alas fire   'firefox'
alas h      'head'
alas ink    'inkscape'
alas libre  'libreoffice'
alas mann   'MANPAGER=less; man '
alas mc     'mc --nosubshell'
alas mi     'nomacs'
alas nn     'neofetch'
alas play   'mpv'
#alas r      'ranger'
alas ra     'ranger'
alas rss    'newsboat'
alas show   'sqlitebrowser'
alas t      'tail'
alas ta     'tail'
#alias t      'GTK_THEME=Adwaita-dark thunar'
alas tu     'GTK_THEME=Adwaita-dark thunar'
alas th     'GTK_THEME=Adwaita-dark thunar'
alas tt     'GTK_THEME=Adwaita-dark thunar'
#alias tar    'tar -xvf'
alas tarr   'tar -xvf'
alas timer  'termdown -B | lolcat'
alas ti     'termdown -B | lolcat'
alas tl     'translit'
alas unrar  'unrar x'
alas v      '${EDITOR}'
alas vim    '${EDITOR}'
alas vmi    '${EDITOR}'
alas vv     'sudo -E ${EDITOR}'
# A trailing space in `xargs ` causes the next word to be checked for
# alias substitution when the alias is expanded.
alas xargs   'xargs '
alas xa      'xargs '
alas yd      'yt-dlp'
# A trailing space in `watch ` causes the next word to be checked for
# alias substitution when the alias is expanded.
#
# Usage:
# watch ple                    # OK:  alias `ple` is expanded as `pacman -Qeq`
# watch ple | rg ^z            # BAD: multiple commands, need to quote everything
# watch "ple | rg ^z"          # BAD: when quoted, aliases do not expand in this case
# watch "pacman -Qeq | rg ^z"  # OK:  no aliases inside quotes
#
# `watch -n 0` is equivalent to `watch -n 0.1`
alas watch   'watch '

#--------------------------------------
# Using programs
#--------------------------------------

# AWK
alas awk-1    'awk '\''{OFS=FS} {print $1}'\'
alas awk-2    'awk '\''{OFS=FS} {print $2}'\'
alas awk-3    'awk '\''{OFS=FS} {print $3}'\'
alas awk-4    'awk '\''{OFS=FS} {print $4}'\'
alas awk--4   'awk '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alas awk--3   'awk '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alas awk--2   'awk '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alas awk--1   'awk '\''{OFS=FS} {print $(NF)}'\'
alas awk--    'awk '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alas awk-t-1  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $1}'\'
alas awk-t-2  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $2}'\'
alas awk-t-3  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $3}'\'
alas awk-t-4  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $4}'\'
alas awk-t--4 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alas awk-t--3 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alas awk-t--2 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alas awk-t--1 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF)}'\'
alas awk-t--  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alas awk-c-1  'awk -F: '\''{OFS=FS} {print $1}'\'
alas awk-c-2  'awk -F: '\''{OFS=FS} {print $2}'\'
alas awk-c-3  'awk -F: '\''{OFS=FS} {print $3}'\'
alas awk-c-4  'awk -F: '\''{OFS=FS} {print $4}'\'
alas awk-c--4 'awk -F: '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alas awk-c--3 'awk -F: '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alas awk-c--2 'awk -F: '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alas awk-c--1 'awk -F: '\''{OFS=FS} {print $(NF)}'\'
alas awk-c--  'awk -F: '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alas awk-s-1  'awk -F/ '\''{OFS=FS} {print $1}'\'
alas awk-s-2  'awk -F/ '\''{OFS=FS} {print $2}'\'
alas awk-s-3  'awk -F/ '\''{OFS=FS} {print $3}'\'
alas awk-s-4  'awk -F/ '\''{OFS=FS} {print $4}'\'
alas awk-s--4 'awk -F/ '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alas awk-s--3 'awk -F/ '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alas awk-s--2 'awk -F/ '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alas awk-s--1 'awk -F/ '\''{OFS=FS} {print $(NF)}'\'
alas awk-s--  'awk -F/ '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alas awk-o-1  'awk -F, '\''{OFS=FS} {print $1}'\'
alas awk-o-2  'awk -F, '\''{OFS=FS} {print $2}'\'
alas awk-o-3  'awk -F, '\''{OFS=FS} {print $3}'\'
alas awk-o-4  'awk -F, '\''{OFS=FS} {print $4}'\'
alas awk-o--4 'awk -F, '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alas awk-o--3 'awk -F, '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alas awk-o--2 'awk -F, '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alas awk-o--1 'awk -F, '\''{OFS=FS} {print $(NF)}'\'
alas awk-o--  'awk -F, '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alas awk-p-1  'awk -F. '\''{OFS=FS} {print $1}'\'
alas awk-p-2  'awk -F. '\''{OFS=FS} {print $2}'\'
alas awk-p-3  'awk -F. '\''{OFS=FS} {print $3}'\'
alas awk-p-4  'awk -F. '\''{OFS=FS} {print $4}'\'
alas awk-p--4 'awk -F. '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alas awk-p--3 'awk -F. '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alas awk-p--2 'awk -F. '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alas awk-p--1 'awk -F. '\''{OFS=FS} {print $(NF)}'\'
alas awk-p--  'awk -F. '\''{OFS=FS} {print $NF}'\'

# Colorls
#alias colorls '\colorls ${COLORLS_COLOR}'
#alias ls      'colorls'
#alias l       'colorls'
#alias la      'colorls -al'
#alias las     'colorls -al'
#alias lc      'colorls -1'
#alias ll      'colorls -lA --report'
#alias lsa     'colorls -a'
#alias lsal    'colorls -al'
#alias lsla    'colorls -al'
#alias lsl     'colorls -l'
#alias ih      '\colorls -al ${COLORLS_COLOR_ALWAYS} | rg -i'
#alias lsh     'colorls -ld .[^.]*'
#alias lsr     'colorls --T'
#alias since   '\colorls -lt ${COLORLS_COLOR_ALWAYS} | head'
#alias sincee  '\colorls -lt
# Display only directories:
#alias dod     'colorls -ld'
#alias dod2    'colorls -d1'
# Display only files:
#alias dof     'colorls -lf'
#alias dof2    'colorls -f1'
# Display only hidden directories:
#alias dohd    'colorls -lAd .[^.]*/'
#alias dohd2   'colorls -Ad1 .[^.]*/'
# Display only hidden files:
#alias doh     "colorls -lA | awk '\$NF ~ /^\.[^/]*$/ { print }'"
#alias doh2    "colorls -1A | awk '\$NF ~ /^\.[^/]*$/ { print }'"

# Cowfortune
alas cff 'fortune | cowsay'
alas cfr 'fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'

# Crontab
alas ce 'crontab -e'
alas cl 'crontab -l'

# du
alas dusort       'du -chs -- * | sort -h'
alas dus          'du -chs -- * | sort -h'
alas dusort.all   'du -chs -- * .* | sort -h'  # include hidden files
alas trackmem     'watch -n 5 "du -chs -- * | sort -h"'
alas trackmem.all 'watch -n 5 "du -chs -- * .* | sort -h"'

# eza
alas eza     '\eza ${EZA_COLOR}'
alas l       'eza'
alas la      'eza -al'
alas las     'eza -al'
alas lc      'eza -1'
#alias ll      'eza -lX'
#alias lsa     'eza -a'
alas lsal    'eza -al'
alas lsla    'eza -al'
alas lsl     'eza -l'
#alias ll      'eza -l'
alas ih      '\eza -al ${EZA_COLOR_ALWAYS} ${EZA_ICONS_ALWAYS} | rg -i'
alas lsh     'eza -ld .[^.]*'
alas lsr     'eza -T'
alas since   '\eza --sort=oldest -l ${EZA_COLOR_ALWAYS} ${EZA_ICONS_ALWAYS} | head'
alas sincee  '\eza --sort=oldest -l'
# Display only directories:
alas dod     'eza -lD --classify=auto'
alas dod2    'eza -D1 --classify=auto'
# Display only files:
alas dof     'eza -lf'
alas dof2    'eza -f1'
# Display only hidden directories:
alas dohd    'eza -ld .[^.]*/ --classify=auto'
alas dohd2   'eza -d1 .[^.]*/ --classify=auto'
# Display only hidden files:
alas doh     'eza -lfa ${EZA_ICONS_ALWAYS} | rg "^\."'
alas doh2    'eza -fa | rg "^\."'
alas tree    'eza -T'

# feh
alas wall 'feh --bg-scale'

# find
#alas ff 'find . -name'

# Git
alas ga    'git add'
alas gap   'git add -p'
alas gau   'git add -u .'
alas gb    'git branch'
alas gc    'git commit'
alas gm    "git commit -m '"
alas gco   'git commit --only'
alas gch   'git checkout'
alas gd    'git diff'
alas gdc   'git diff --cached'
alas gl    'git pull'
alas glg   'git lg'
alas gp    'git push'
alas gr    'git restore'
alas grem  'git remote -v'
alas grs   'git restore --staged'
alas grc   'git rm -r --cached'
alas gitr  'git rev-list --all --pretty=oneline -- '
alas gs    'git status'
#alias clone 'git clone'
# By default, `git fetch` does not remove remote branches that
# no longer have a counterpart branch on the remote. In order
# to do that, one explicitly needs to prune the list of remote branches:
# `git fetch --prune`. This will automatically get rid of remote branches
# that no longer exist on the remote. Afterwards, `git branch --remote`
# will show an updated list of branches that really exist on the
# remote: And those one can delete using git push.
alas gfp   'git fetch --prune'
alas gaa   'git add . && git commit -m '.' && git push'
alas gcp   'git commit -m '.' && git push'
# Git bare repository for dotfiles
#alas dot   '/usr/bin/git --git-dir=${HOME}/.dotfiles/ --work-tree=${HOME}'
alas dsa   'dot add'
alas dsau  'dot add -u .'
alas dsua  'dot add -u .'
alas dsc   'dot commit'
alas dm    "dot commit -m '"
alas dsco  'dot commit --only'
alas dsd   'dot diff'
alas dd    'dot diff'
alas dsd.  'dot diff .'
alas dd.   'dot diff .'
alas dsde  'PAGER=delta dot diff'
alas dsdc  'dot diff --staged'
alas dsdce 'PAGER=delta dot diff --staged'
alas dsg   'dot lg'
alas dsl   'dot pull'
alas dsp   'dot push'
alas dsr   'dot restore'
alas dsrc  'dot restore --staged'
alas dotr  'dot rev-list --all --pretty=oneline -- '
alas ds    'dot status'
alas ds.   'dot status .'
alas dsu   'dot status -u .'

# GitHub CLI
alas gg 'gh copilot suggest'
alas ge 'gh copilot explain'

# Grep
#alias grep       'grep --color=auto'
#alias grepc      'grep --color=always'
#alias grepi      'grep -i'
#alias grep.find  'grep -rHn'
#alias grepi.find 'grep -i -rHn'

# ls
#alias ls     '\ls ${LS_COLOR}'
#alias l      'ls'
#alias la     'ls -al'
#alias las    'ls -al'
#alias lc     'ls -1'
#alias ll     'ls -lL'
#alias lsa    'ls -a'
#alias lsal   'ls -al'
#alias lsla   'ls -al'
#alias lsl    'ls -l'
#alias ih     '\ls -al ${LS_COLOR_ALWAYS} | rg -i'
#alias lsh    'ls -ld .[^.]*'
#alias lsr    'ls -R'
#alias since  '\ls -ltL ${LS_COLOR_ALWAYS} | head'
#alias sincee '\ls -ltL'
# Display only directories:
#alias dod    '\ls -l ${LS_COLOR_ALWAYS} | rg ^d'
#alias dod2   '\ls -1F ${LS_COLOR_ALWAYS} | rg /'
# Display only files:
#alias dof    '\ls -l ${LS_COLOR_ALWAYS} | rg ^-'
#alias dof2   '\ls -1F ${LS_COLOR_ALWAYS} | rg -v /'
# Display only hidden directories:
#alias dohd   'ls -ld .[^.]*/'
#alias dohd2  'ls -ad1 .[^.]*/'
# Display only hidden files:
#alias doh    "ls -lAp | awk '{ if ($NF ~ /^\.[^/]*$/) print }'"
#alias doh2   'ls -ap | rg "^\.[^/]*$"'

# mpv
alas mpv.image   'mpv --no-config --pause --vo=tct'
alas mpv.video   'mpv --no-config --vo=tct'
alas mpv.youtube 'mpv -vo=caca'

# Neovim
alas vib              '${EDITOR} -b'
alas vim.bare         '${EDITOR} -u NONE'
alas vim.plug.up      '${EDITOR} +PackerSync'
alas vim.plug.clean   '${EDITOR} +PackerClean'
alas vim.plug.list    '${EDITOR} +PackerStatus'

# Redshift
alas red.norm 'redshift -P -O 6500'
alas red.warm 'redshift -P -O 5000'

# Ripgrep
alas rg             'rg --color=auto --no-heading'    # Basic colored search
alas grep           'rg --color=auto --no-heading'    # Basic colored search
alas grepc          'rg --color=always --no-heading'  # Force color always
alas grepi          'rg -i --no-heading'              # Case-insensitive search
alas grep.find      'rg -Hn --no-heading'             # Recursive is default; show filename + line number
alas grep.find_all  'rg -Hn --no-heading --hidden'    # Same, but include hidden files
alas grepi.find     'rg -i -Hn --no-heading'          # Same, but case-insensitive
alas grepi.find_all 'rg -i -Hn --no-heading --hidden' # Same, but case-insensitive

# Scrot
alas pic 'scrot -s ${HOME}/Screenshots/screenshot-%F-%H%M%S.png'

# SSH
#alias sa   'ssh-add'
alas sl   'ssh-add -l'
alas ssid 'eval $(ssh-agent -s)'

# Subversion
# --Preview
#alias s            'svn status'
alas s            'git status'
alas si           'svn info'
alas sd           'svndiff'
#alias sdd          'svn diff'
alas ssd          'svn diff --diff-cmd="meld"'
alas svn.log      'svn log -r 1:HEAD'
alas svn.log.head 'svn log -r HEAD:1 --limit 5'
alas slg          'svn log -r HEAD:1 --limit 5'
alas scat         'svn cat'
# --Actions
alas sa           'svn add'
alas san          'svn add -N'
#alias sr           'svn revert `--use-commit-times`'
alas scc          'svn copy'
alas sm           'svn move'
alas ci           'svn commit'
alas cim          'svn commit -m'
#alas sc           'confirm "svn cleanup --remove-unversioned"'
#alas key          'svn propset svn:keywords "Author Date Revision URL Id"'
#alas ex           'svn propset svn:executable on'
alas svn.checkout 'svn checkout `--use-commit-times`'
alas svn.up       'svn update `--use-commit-times`'
alas sup          'svn update `--use-commit-times`'
alas svn.recommit 'svn commit -F svn-commit.tmp'
alas svn.clean    'svn cleanup --remove-unversioned'

# Tmux
alas tmux.ls    'tmux ls'
alas tl         'tmux ls'
alas tmux.which "tmux display-message -p '#S'"

# wmctrl
alas win  'wmctrl -l'
alas winx 'wmctrl -lx'
alas wing 'wmctrl -l -G'

# yt-dlp
alas ydn             'yt-dlp --no-playlist'
alas yda             'yt-dlp --extract-audio'
# ^--- Extract audio from a whole playlist
alas ydna            'yt-dlp --no-playlist --extract-audio'
alas ydna3           'yt-dlp --no-playlist --extract-audio --audio-format mp3'
alas ydl-clean-cache 'yt-dlp --rm-cache-dir'

# Zoxide
# ...

#--------------------------------------
# Killing programs
#--------------------------------------

alas kc    'killall cmus'
alas stop  'killall mpg123'
alas x.out 'killall xinit'

#------------------------------------------------------------------------------
# 20. Configs
#------------------------------------------------------------------------------

#---------------------------------------
# Switching configs
#---------------------------------------

alas emacs.gnu  'ln -nsf ${XDG_CONFIG_HOME}/emacs-gnu ${XDG_CONFIG_HOME}/emacs'
alas emacs.doom 'ln -nsf ${XDG_CONFIG_HOME}/emacs-doom ${XDG_CONFIG_HOME}/emacs'

#---------------------------------------
# Reloading configs
#---------------------------------------

alas mkgrub       'sudo grub-mkconfig -o /boot/grub/grub.cfg'
alas mkinit       'sudo mkinitcpio -p linux'
alas xres.restart 'xrdb ${XDG_CONFIG_HOME}/X11/Xresources'
alas retmux       'tmux kill-server; tmux source-file ~/.tmux.conf; tmux'
alas reh          'rehash'
alas a            'source ${ZDOTDIR}/.zshrc'

#---------------------------------------
# Editing configs
#---------------------------------------

alas al     '${EDITOR} ${ZDOTDIR}/aliases.zsh'
alas cm     '${EDITOR} ${XDG_CONFIG_HOME}/picom/picom.conf'
alas dun    '${EDITOR} ${XDG_CONFIG_HOME}/dunst/dunstrc'
alas ee     '${EDITOR} ${XDG_CONFIG_HOME}/emacs-gnu/init.el'
alas eed    '${EDITOR} ${XDG_CONFIG_HOME}/doom/init.el'
alas fn     '${EDITOR} ${ZDOTDIR}/functions.zsh'
alas fn.fzf '${EDITOR} ${ZDOTDIR}/fzf-functions.zsh'
alas gconf  '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
alas ic     '${EDITOR} ${XDG_CONFIG_HOME}/i3/config'
alas icc    '${EDITOR} ${XDG_CONFIG_HOME}/i3blocks/config'
alas lal    '${EDITOR} ${ZDOTDIR}/aliases.local.zsh'
alas lfn    '${EDITOR} ${ZDOTDIR}/functions.local.zsh'
alas mime   '${EDITOR} ${XDG_CONFIG_HOME}/mimeapps.list'
alas rc     '${EDITOR} ${XDG_CONFIG_HOME}/openbox/rc.xml'
alas rr     '${EDITOR} ${XDG_CONFIG_HOME}/ranger/rc.conf'
alas start  '${EDITOR} ${XDG_CONFIG_HOME}/openbox/autostart'
alas tg     '${EDITOR} ${XDG_CONFIG_HOME}/tig/config'
alas tintrc '${EDITOR} ${XDG_CONFIG_HOME}/tint2/tint2rc'
alas tmuxr  '${EDITOR} ${XDG_CONFIG_HOME}/tmux/tmux.conf'
alas xi     '${EDITOR} ${XDG_CONFIG_HOME}/X11/xinitrc'
alas xres   '${EDITOR} ${XDG_CONFIG_HOME}/X11/Xresources'
alas zenv   '${EDITOR} ${ZDOTDIR}/.zshenv'
alas zr     '${EDITOR} ${ZDOTDIR}/.zshrc'

#------------------------------------------------------------------------------
# 21. Window manager-specific
#------------------------------------------------------------------------------

#---------------------------------------
# i3
#---------------------------------------

alas i3.out       'i3-msg exit'
alas cmus.run     'urxvt -name dropdown_aux -e tmux new-session cmus &'
alas cmus.scratch "i3-msg 'exec --no-startup-id urxvt -name dropdown_aux -e tmux new-session cmus\;'"
# Avoid tmux session using an old I3SOCK environment variable after i3 restart
# Run this instead of `i3-msg` while in tmux
alas i3-msg-tmux  'i3-msg --socket "${XDG_RUNTIME_DIR}/i3/$(\ls -t ${XDG_RUNTIME_DIR}/i3/ | awk "{OFS=FS} {print $1}" | rg ipc | head -n 1)"'

#----------------------------------------
# Hyprland
# ---------------------------------------

alas hout         'hyprctl dispatch exit'

#---------------------------------------
# Openbox
#---------------------------------------

alas autostart    '${XDG_CONFIG_HOME}/openbox/autostart'
alas dout         'openbox --exit'
alas theme.matrix '${BIN}/openbox-themes/matrix/enable'
alas theme.riddle '${BIN}/openbox-themes/riddle/enable'
alas f2of         'openbox-disable-F2-keybinding'
alas f2on         'openbox-reenable-F2-keybinding'
alas reop         'openbox --reconfigure'

#----------------------------------------
# Sway
# ---------------------------------------

# Run this instead of `swaymsg` while in tmux
alas swaymsg-tmux 'swaymsg --socket "$(find /run/user/$(id -u)/sway-ipc.* -type s 2>/dev/null | sort -t. -k2 -n | tail -n1)"'
alas sout         'swaymsg-tmux exit'

#------------------------------------------------------------------------------
# 22. Aliases to Zsh functions
#------------------------------------------------------------------------------

alas fe     'edit-file'
alas fea    'edit-file --hidden'
alas f      'fieldc tab'
alas cols   'colv tab'
alas hs     'https_to_ssh'
alas clones 'git_clone_ssh'
alas tc     'tmux-clean'
alas ver    'version'
alas clone  'git_clone_ssh'
alas wa     'waste'
alas ff     'find.file'

#------------------------------------------------------------------------------
# 23. Aliases to scripts
#------------------------------------------------------------------------------

alas setx   'set-keyboard-layout'
alas thanks '(${BIN}/sounds/thanks-hal &) > /dev/null'
alas dark   'set-dark-gtk-theme'
alas light  'set-light-gtk-theme'

#------------------------------------------------------------------------------
# 24. Aliases as flags
#------------------------------------------------------------------------------

# Usage: command `--use-commit-times`
alas --use-commit-times 'echo --config-option=config:miscellany:use-commit-times=yes'
alas -uname             'uname -sm | sed -e "s/-.* / /" -e "s/ /-/g"'
alas --uname            'uname -srm | sed -e "s/-.* / /" -e "s/ /-/g"'
alas --datetime         'date +%F_%H_%M_%S'
alas --retrieved-time   'date '\''+%F %H:%M'\'''
alas --datecomment      'date "+#DATE: %F %T %Z"'

alas -time              'date +%H:%M:%S'
alas --time             'date +%H:%M:%S'
alas -date              'date +%Y.%m.%d'
alas --date             'date +%Y-%m-%d'
alas -today             'date +%Y.%m.%d'
alas --today            'date +%Y-%m-%d'
alas -tomorrow          'date -d now+1day +%Y.%m.%d'
alas --tomorrow         'date -d now+1day +%Y-%m-%d'
alas -after-tomorrow    'date -d now+2days +%Y.%m.%d'
alas --after-tomorrow   'date -d now+2days +%Y-%m-%d'
alas -yesterday         'date -d now-1day +%Y.%m.%d'
alas --yesterday        'date -d now-1day +%Y-%m-%d'
alas -before-yesterday  'date -d now-2days +%Y.%m.%d'
alas --before-yesterday 'date -d now-2days +%Y-%m-%d'
alas -a-week-ago        'date -d now-7days +%Y.%m.%d'
alas --a-week-ago       'date -d now-7days +%Y-%m-%d'
alas -in-a-week         'date -d now+7days +%Y.%m.%d'
alas --in-a-week        'date -d now+7days +%Y-%m-%d'

#------------------------------------------------------------------------------
# 25. Programming
#------------------------------------------------------------------------------

#---------------------------------------
# Languages
#---------------------------------------

# Python
alas p         'python'
alas pi        'ipython --TerminalInteractiveShell.editing_mode=vi'
alas py.exe    'python -c'
alas qenv      'deactivate'
alas venv.init 'python3 -m venv .venv'
alas venv      'source .venv/bin/activate'

# C
alas gdb.super 'gdb --batch --ex run --ex bt --ex q --args'
alas vl        'valgrind'
alas vll       'vlt --leak-check=full --show-leak-kinds=all'
alas vllv      'vlt --leak-check=full --show-leak-kinds=all -v'
alas vlt       'valgrind --track-origins=yes --leak-check=full'
alas vt        'valgrind --track-origins=yes'

#---------------------------------------
# Frameworks
#---------------------------------------

# Django
alas pmp  'python manage.py'
alas runs 'python manage.py runserver'
alas mig  'pmp makemigrations && pmp migrate'

#---------------------------------------
# Databases
#---------------------------------------

alas mg  'mysql -u root -p'
alas mgu 'mysql -u user -p'
alas pg  'sudo -iu postgres psql postgres'

#------------------------------------------------------------------------------
# 26. Misc
#------------------------------------------------------------------------------

# Count files in the directory:
alas cf        'setopt CSH_NULL_GLOB; files=(*); echo ${#files[@]};'
# Count only hidden files in the directory:
alas cfa       'setopt CSH_NULL_GLOB; files=(.*); echo ${#files[@]};'
# Count directories:
alas cfd       'setopt CSH_NULL_GLOB; dirs=(*/); echo ${#dirs[@]};'
alas empty     'truncate -s 0'
alas fld       'fold -w 80 -s'
alas immutable 'sudo chattr +i'
alas mutable   'sudo chattr -i'
alas prun      'perldoc perlrun'  # Similar text can be shown with `man perlrun`
alas rl        'readlink -f'
alas rows      'tr "\\n" " "'  # Used in a pipe, ... | rows
alas tag       'ctags -R .'
alas wl        'wc -l'
alas xres.show 'xrdb -query -all'

#------------------------------------------------------------------------------
# 27. Temporary (maybe they will stick)
#------------------------------------------------------------------------------

alas books    '${EDITOR} -c "e ${PRO}/archived/2022/books/bibliography.bib | :c %:p:h"'
alas get.date '--datetime | tr -d '\n' | copy'
alas pasta    '${EDITOR} "${DOTSHARE}/misc/pastes.tsv"'
alas pst      'c ${PRO}/archived/2022/npBuild && ./packageStats'
alas sg       'c ${MP1}/SG_shell_settings'
alas xav      'xargs ${EDITOR}'
alas dq       'c ${MP1}/dataquest'
alas irc      '${EDITOR} "${XDG_CONFIG_HOME}/ideavim/ideavimrc"'
alas sc       'shellcheck'
alas paco     'pacman -Qo'
alas rehist   'fc -R'
alas smv      'sudo mv'
#alias scp      'sudo cp -r'
alas srm      'sudo rm -r'
# Find word differences in a unified diff stream and colourise them:
# Intended possible use: 'svn diff | wd'
alas wd       'wdiff -d | colordiff'
alas mydata   'whoami; pwd; hostname -f; test -d .svn && svnversion; test -d .svn && svn info; date'
alas pd       'pushd'
alas pop      'popd'
alas md       'mkdir'
alas rd       'rmdir'
alas go       'xdg-open'
alas gonull   'xdg-open &> /dev/null'
alas cutc     'cut -b 1-${COLUMNS}'
alas ddf      'df -hP | rg ^/'
alas mf       'manf'
alas p3       'python3.13'
alas d        'sudo docker'
alas di       'sudo docker images'
alas dv       'sudo docker volume ls'
alas dn       'sudo docker network ls'
alas ms       'mongosh'

#alias run   'npm start'
alas run   'npm run dev'
alas det   'bg && disown'
alas down  'sudo downgrade'
alas dir   'vidir'
alas rux   'npx react-scripts start'
alas glh   'git lg --color=always | head -n 15'
#alas del   "sed -i '/^\[core\]/,/^\[/{s/^[ \t]*#\s*pager/    pager/}' ${XDG_CONFIG_HOME}/git/config"
#alas nodel "sed -i '/^\[core\]/,/^\[/{s/^\([ \t]*\)pager/\1#pager/}' ${XDG_CONFIG_HOME}/git/config"
# “del”: uncomment only the “pager = delta” line
alas del "sed -i '/^\[core\]/,/^\[/{s/^\([[:space:]]*\)#\s*\(pager[[:space:]]*=[[:space:]]*delta\)/\1\2/}' ${XDG_CONFIG_HOME}/git/config"
# “nodel”: comment out only the “pager = delta” line
alas nodel "sed -i '/^\[core\]/,/^\[/{s/^\([[:space:]]*\)\(pager[[:space:]]*=[[:space:]]*delta\)/\1#\2/}' ${XDG_CONFIG_HOME}/git/config"
alas vr    "c ${XDG_CONFIG_HOME}/nvim/lua"
alas hyp   '${EDITOR} ${XDG_CONFIG_HOME}/hypr/hyprland.conf'
alas zo    '${EDITOR} ${ZDOTDIR}/.zprofile'
alas ala   '${EDITOR} ${XDG_CONFIG_HOME}/alacritty/alacritty.toml'
alas j     'z'
alas gi    '${EDITOR} .gitignore'
alas ig    '${EDITOR} .gitignore'
alas o    'bat'
alas parup '\paru'
alas swa   'c ${XDG_CONFIG_HOME}/sway/'
alas ic   '${EDITOR} ${XDG_CONFIG_HOME}/sway/config'
alas w 'wlprop'
alas nv '${EDITOR} -u NONE'
alas or '${EDITOR} ${XDG_CONFIG_HOME}/obsidian/obsidian.vimrc'
alas key '${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/config/keybindings.lua'
alas mak '${EDITOR} Makefile'
alas gcl 'git clean'
alas ve  'source .venv/bin/activate'
alas gpf 'git push --force'
alas w  'which'
alas kx 'killall swaybar'
alas r      'rm'
alas kh 'killall Hyprland'
alas mdir 'mkdir'
alas cprf 'sudo cp -r'

alas lrc     '${EDITOR} ${XDG_CONFIG_HOME}/labwc/rc.xml'
alas lstart  '${EDITOR} ${XDG_CONFIG_HOME}/labwc/autostart'
alas lreop  'labwc --reconfigure'
alas lab 'cd ${XDG_CONFIG_HOME}/labwc'
alas kl 'killall labwc'
alas lout 'labwc --exit'
alas ka 'killall'
alas dif 'diff'

alas gf   'rg -Hn --no-heading'             # Recursive is default; show filename + line number
alas gfa  'rg -Hn --no-heading --hidden'    # Same, but include hidden files
alas gfi  'rg -i -Hn --no-heading'          # Same, but case-insensitive
alas gfai 'rg -i -Hn --no-heading --hidden' # Same, but case-insensitive

alas he 'help'
alas gitconf  '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
alas gitc  '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
alas caa '\cat'
alas h-1 'head -n 1'
alas t-1 'tail -n 1'
alas me 'make extract'
alas calc 'qalc'
alas his '${EDITOR} ${ZDOTDIR}/histfile'

alas t-1 'tail -n 1'
alas t-2 'tail -n 2'
alas t-3 'tail -n 3'
alas t-4 'tail -n 4'
alas t-5 'tail -n 5'

alas plug  "${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/plugins/init.lua"
alas lsp  "${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/plugins/nvim-lspconfig.lua"
alas cmd  "${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/config/commands.lua"

alas lk './list-keyword-lengths.sh amazon_ms_keywords/v4/amazon_ms_keywords_2025-06-05_13_24_55.ttsv'

#alas b 'btm'
alas b 'bat'
alas g 'glow'
alas i 'cheat -c'
alas k 'kubectl'
alas m 'mv'
alas n 'npm'
alas u 'uv-run'
alas y 'yazi'
alas bro 'bro 2>/dev/null'
