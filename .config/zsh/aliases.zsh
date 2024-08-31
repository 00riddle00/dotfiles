# vim:tw=79:sw=2:ts=2:sts=2:et
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-31 14:59:50 EEST
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

alias() {
  builtin alias -- ${1}="${2}"
}

#------------------------------------------------------------------------------
# 1. Navigation
#------------------------------------------------------------------------------

# Going up
alias ./    'c ..'
alias ..    'c ..'
alias ...   'c ../..'
alias ....  'c ../../..'
alias ..... 'c ../../../..'
alias -     'c "${OLDPWD}"'
alias c-    'c "${OLDPWD}"'

# Temporary directories
alias mp  'cd ${MP} '
alias mp1 'cd ${MP1}'
alias mp2 'cd ${MP2}'
alias mp3 'cd ${MP3}'
alias mp4 'cd ${MP4}'
alias mp5 'cd ${MP5}'
alias mp6 'cd ${MP6}'
alias mp7 'cd ${MP7}'
alias mp8 'cd ${MP8}'
alias mp0 'cd ${MP0}'

# Various locations
alias bak      'cd ${HOME}/backups'
alias bin      'cd ${BIN}'
alias cache    'cd ${XDG_CACHE_HOME}'
alias can      'cd ${CANDY}'
alias conf     'cd ${XDG_CONFIG_HOME}'
alias drop     'cd ${DROPBOX}'
alias drop.bak 'cd ${DROPBOX}/backup'
alias dw       'cd ${XDG_DOWNLOAD_DIR}'
alias hist     'cd ${HOME}/histfiles/'
alias lok      'cd ${HOME}/.local'
alias share    'cd ${XDG_DATA_HOME}'
alias dots     'cd ${DOTSHARE}'
alias notes    'cd ${NOTES}'
alias op       'cd ${XDG_CONFIG_HOME}/openbox'
alias pro      'cd ${PRO}'
alias np       'cd ${PRO}/2022/npBuild'
alias sol      'cd ${PRO}/2023/Solutions-To-Problems/Codewars'
alias tem      'cd ${PRO}/2023/Solutions-To-Problems/Codewars/temp'
alias res      'cd ${XDG_DATA_HOME}/tmux/resurrect'
alias sk       'cd ${SCREENSHOTS}'
alias we       'cd ${MP1}/webuzz && venv'
alias bu       'cd ${MP1}/budget && venv'
alias vid      'cd ${XDG_VIDEOS_DIR}'
alias was      'cd ${HOME}/wastebasket'
alias zdot     'cd ${ZDOTDIR}'

#------------------------------------------------------------------------------
# 2. Getting information
#------------------------------------------------------------------------------

# Hostname and path
alias host 'echo ${HOST}'
alias path 'echo ${PATH} | tr ":" "\n"'

# Disk info
alias fl 'sudo fdisk -l'
alias lf 'lsblk -f'

# Video info
alias gpu.load   'watch -n 1 nvidia-smi'
alias gpu.which  'glxinfo | grep -E "OpenGL vendor|OpenGL renderer"'
alias info.video 'lspci | grep -e VGA -e 3D'

# Window info
alias get.win_class    'xprop | grep -i class'
alias get.win_pos_size 'xwininfo'
alias getpos           'xwininfo -id $(xdotool getactivewindow)'

# Keyboard keys info
alias get.key_code_1 'sed -n l'
alias get.key_code_2 'showkey --ascii'
alias get.keyname    'xev'
# ^--press keys and Enter (`cat` also can be used)

#------------------------------------------------------------------------------
# 3. Standard commands
#------------------------------------------------------------------------------

alias x     'clear'
alias q     'exit'
alias re    'reboot'
alias off   'poweroff'
alias prego 'sudo $(fc -ln -1)'
alias cpr   'cp -r'
alias rmr   'rm -rf'
alias rmrf  'sudo rm -r'

#------------------------------------------------------------------------------
# 4. Modifying shell behavior
#------------------------------------------------------------------------------

alias show_hidden 'setopt -s glob_dots'

#------------------------------------------------------------------------------
# 5. Permissions
#------------------------------------------------------------------------------

alias exe   'chmod +x'
alias noexe 'chmod -x'
alias let   'chmod 755'
alias letr  'chmod -R 755'
alias ch    'sudo chown -R ${USER}:${USER}'

#------------------------------------------------------------------------------
# 6. Clipboard
#------------------------------------------------------------------------------

alias copy       'xclip -selection clipboard'
alias ll         'xclip -selection clipboard'
alias xclip.clip 'xclip -selection clipboard'
alias xclip.prim 'xclip -selection primary'
alias xclip.sec  'xclip -selection secondary'

#------------------------------------------------------------------------------
# 7. Fonts
#------------------------------------------------------------------------------

alias fonts.current 'fc-match --verbose Sans'
alias fonts.list    "fc-list ':' file"
alias fonts.find    'fc-list | grep -i'
alias fonts.match   'fc-match'
alias fonts.update  'fc-cache -fv'

#------------------------------------------------------------------------------
# 8. Keyboard layouts
#------------------------------------------------------------------------------
#
alias lt           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt'
# ^-- Choosing 'lt' also resets languages to the usual 'us,lt' combination
alias de           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,de'
alias es           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,es'
alias he           'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il'
alias ru           "setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle -layout 'us,lt,ru' -variant ',,phonetic'"
alias emacs.caps   'setxkbmap -option && fix-xkbmap'
alias emacs.nocaps 'setxkbmap -option ctrl:nocaps'
alias nocaps       'sudo dumpkeys | sed "s/\s*58\s*=\s*Caps_Lock/ 58 = Control/" | sudo loadkeys'

#------------------------------------------------------------------------------
# 9. Screen brightness
#------------------------------------------------------------------------------

alias xminus 'light -U 10'
alias xplus  'light -A 10'

#------------------------------------------------------------------------------
# 10. Sound
#------------------------------------------------------------------------------

alias aminus 'amixer set Master 10%-'
alias aplus  'amixer set Master 10%+'
alias mute   'amixer -q sset Master toggle'

#------------------------------------------------------------------------------
# 11. Clock and time
#------------------------------------------------------------------------------

alias clock.sync      'sudo ntpd -qg'
alias timezone.update 'timedatectl set-timezone "$(curl --fail https://ipapi.co/timezone)"'

#------------------------------------------------------------------------------
# 12. Systemd
#------------------------------------------------------------------------------

# General
alias systemd.boot       'systemd-analyze blame'
alias systemd.boot_total 'systemd-analyze time'
alias systemd.enabled    'systemctl list-unit-files | grep enabled'
alias systemd.enabled.2  'find /etc/systemd -type l -exec test -f {} \; -print | awk -F'\''/'\'' '\''{ printf ("%-40s | %s\n", $(NF-0), $(NF-1)) }'\'' | sort -f'
# ^--- Kudos to seth! (https://bbs.archlinux.org/profile.php?id=63451)
alias systemd.list       'systemctl list-unit-files'
alias systemd.running    'systemctl --type=service'

# Databases
alias most 'systemctl start mongodb'
alias myst 'systemctl start mysqld'
alias post 'systemctl start postgresql'

# Servers
alias apache   'systemctl start httpd.service'
alias reapache 'systemctl restart httpd'

# Wired
alias net     "systemctl start dhcpcd@$(basename -a /sys/class/net/enp*).service"
alias renet   "systemctl restart dhcpcd@$(basename -a /sys/class/net/enp*).service"
alias lan.on  "sudo ip link set $(basename -a /sys/class/net/enp*) up"
alias lan.off "sudo ip link set $(basename -a /sys/class/net/enp*) down"

# Wireless
alias wnet     "systemctl start dhcpcd@$(basename -a /sys/class/net/wlp*).service"
alias rewnet   "systemctl restart dhcpcd@$(basename -a /sys/class/net/wlp*).service"
alias wifi.on  "sudo ip link set $(basename -a /sys/class/net/wlp*) up"
alias wifi.off "sudo ip link set $(basename -a /sys/class/net/wlp*) down"

#------------------------------------------------------------------------------
# 13. Network
#------------------------------------------------------------------------------

alias pp                'ping -c 3 www.google.com'
alias pwp               'watch -n 0.5 "ping -c 3 www.google.com"'
alias check.ip          'whois'
alias check.dns         'nslookup'
alias check.domain      'whois'
alias get.my_ip         'curl -w "\n" ifconfig.me'
alias get.local_ip      'ip route | head -n 1'
alias get.gateway       'ip route | head -n 1'
alias get.net_interface 'ip route | head -n 1'  # Get the current active interface name

#------------------------------------------------------------------------------
# 14. WPA Supplicant
#------------------------------------------------------------------------------

alias wpa.android  "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/android.conf"
alias wpa.caffeine "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/caffeine.conf"
alias wpa.comet    "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/comet.conf"
alias wpa.home     "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/home.conf"
alias wpa.huracan  "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/huracan.conf"
alias wpa.iphone   "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/iphone.conf"
alias wpa.sodas    "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/sodas.conf"
alias wpa.wpa      "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/wpa_supplicant.conf"

#------------------------------------------------------------------------------
# 15. Mount/Unmount
#------------------------------------------------------------------------------

alias phone.on  'simple-mtpfs ${HOME}/iPhone'  # If problems, remount + restart thunar
alias phone.off 'umount ${HOME}/iPhone'

#------------------------------------------------------------------------------
# 16. Process Management
#------------------------------------------------------------------------------

alias kil 'kill -9'

# `ps -e` displays every active process on a Linux system in Unix format
alias ae 'ps -e | grep -v grep | grep -i'
#     Use `ps c -ef` for a simple name of executable (as well as showing process status)

# '-f' performs a full-format listing
alias aef 'ps -ef | grep -m1 ""  && ps -ef | grep -v grep | grep -i'

# Another way of listing (shows session id)
alias aes "ps -e -o 'user,pid,pgid,sess,args' | grep -m1 \"\" && ps -e -o 'user,pid,pgid,sess,args' | grep -v grep | grep -i"

# Display all processes in BSD format
#     'a' option displays the processes belonging to every user
#     'x' option tells ps to show all the processes regardless of
#         what terminal (if any) they are controlled ('?" in TTY column indicated
#         no controlling terminal)
alias au 'ps ax | grep -v grep | grep -i'
#     Use `ps cax` for a simple name of executable (as well as showing process status)

#     'u' option is for user-oriented format
alias aux 'ps aux | grep -v grep | grep -i'

# Also show parent PID
alias aup 'ps ax l | grep -v grep | grep -i'

# Show sleeping processes
alias asleep 'ps ax | grep -v grep | grep sleep'

# fuser -v {file/socket name(s)} - show info about process, working with the file(s)/socket(s)
alias fuserv 'fuser -v'

# fuser -vk {file/socket name(s)} - kill the process working with the file(s)/socket(s)
# E.g. usage: fuser -vk *.log
alias fuserk 'fuser -vk'

#------------------------------------------------------------------------------
# 17. Package management
#------------------------------------------------------------------------------

#---------------------------------------
# npm
#---------------------------------------

alias npm.ls   'npm list --depth=0'
alias npm.ls.g 'npm list -g --depth=0'

#---------------------------------------
# Pacman
#---------------------------------------

#------------------
# -Q flag
#------------------

alias orphans             'pacman -Qdtq'
alias is                  'pacman -Qeq | grepi '                     # Grep for explicitly installed package (package 'is' in the system)
alias isa                 'pacman -Qq | grepi '                      # Grep for installed package ('isa' = 'is -a' as in 'ls -a', with 'implicitly installed packages' as 'hidden files')
alias visa                'pacman -Q | grepi '                       # Grep for installed package with version info ('visa' = 'is -a -v')
alias pl                  'pacman -Qeq'                              # List explicitly installed packages
alias ple                 'pacman -Qeq'                              # ------||------
alias ple_no_aur          'a_minus_b <(ple) <(plm)'                  # List explicitly installed packages (without showing AUR packages)
alias pla                 'pacman -Qq'                               # List all installed packages
alias pld                 'pacman -Qdq'                              # List packages dependencies
alias plm                 'pacman -Qmq | sort'                       # List foreign packages (mainly from AUR) (pacman lists packages in a different way than "sort" command!)
alias pac.owner           'pacman -Qo'                               # Which package owns the specified file(s)
alias pac.group           'pacman -Qgq'                              # List installed packages belonging to a group (or list all groups and packages if no argument is passed)
alias pac.group.belongs   'pacman -Qgq | grepi'                      # Show which group the installed package belongs to
alias pac.base            'a_and_b <(pac.base_remote) <(pla)'        # List installed packages depending on `base` metapackage
alias pac.base-devel      'a_and_b <(pac.base-devel_remote) <(pla)'  # List installed packages depending on `base-devel` metapackage
alias pac.info            'pacman -Qi'                               # Display info on a given installed package
alias pac.search          'pacman -Qs'                               # Search each installed package for names or descriptions that match regexp
alias pac.check_files     'pacman -Qk'                               # For all installed pkgs, check that all files owned by the given package(s) are present on the system.
alias pac.check_files_det 'pacman -Qkk'                              # More detailed checking (+ permissions, file sizes, and modification times) for pkgs that contain the needed mtree file.

#------------------
# -R flag
#------------------

alias pacr         'sudo pacman -Rns'
alias freeorphans  'sudo pacman -Rns $(pacman -Qdtq)'
# Avoid using the -d option with pacman. pacman -Rdd package skips dependency checks during package removal.
# As a result, a package providing a critical dependency could be removed, resulting in a broken system.
alias pac.forcedel 'sudo -k pacman -Rdd'

#------------------
# -S flag
#------------------

alias pacfile               'sudo pacman -S --noconfirm - --needed <'      # Install from file
alias pacs                  'sudo pacman -S --noconfirm --needed'          # `needed` does not reinstall targets that are up to date
alias pac.group_remote      'pacman -Sgq'                                  # List packages from sync database belonging to a group
alias pac.base_remote       'expac -S '%E' base | xargs -n1 | sort'        # List packages from sync database depending on `base` metapackage
alias pac.base-devel_remote 'expac -S '%E' base-devel | xargs -n1 | sort'  # List packages from sync database depending on `base-devel` metapackage
alias pac.info_remote       'pacman -Si'                                   # Display info on a given sync database package
alias pac.info_remote_full  'pacman -Sii'                                  # ^--- and also display those packages in all repos that depend on this package.
alias pac.search_remote     'pacman -Ss'                                   # Search each package from sync database for names or descriptions that match regexp
# Removes uninstalled packages from /var/cache/pacman/pkg and cleans unused
# repos in /var/lib/pacman
alias pac.clear             'sudo pacman -Sc'
# Removes ALL packages from /var/cache/pacman/pkg and ...
alias pac.clear_all         'sudo pacman -Scc'
# Fuzzy-search through all available packages, with package info shown in a preview window, and then install selected packages
alias fzf.pac               'pacman -Slq | fzf -m --preview 'pacman -Si {1}' | xargs -ro sudo pacman -S'
# -------------------------------------------------------------------------
# Updates the pkg databases if the repositories haven’t been checked
# recently, and upgrades any new package versions.
# -y -> update
# -u -> upgrade
alias up                    'sudo pacman -Syu'
# Forces updates of the databases for all repositories (even if it
# was just updated recently) and upgrades any new package versions.
alias up1                   'sudo pacman -Syyu'
#  Upgrades packages and also downgrades packages (if one happens to have a
#  newer version than in the repository). Normally this should not be used.
#  Only if one is trying to fix a specific issue due to a new package being
#  removed from the repository.
alias up2                   'sudo pacman -Syuu'
# -------------------------------------------------------------------------

#---------------------------------------
# Paru
#---------------------------------------

alias parus     'paru -S'
alias paru.info 'paru -Si'
alias parug     'paru -G'
# Fuzzy-search through the AUR, preview info and install selected packages
alias fzf.paru  'paru -Slq | fzf -m --preview "paru -Si {1}" | xargs -ro paru -S --noconfirm'

#---------------------------------------
# PIP
#---------------------------------------

alias pipi  'pip install'
alias pipir 'pip uninstall'
alias pir   'pip install -r requirements.txt'
alias pipu  'pip install --upgrade pip'
alias wpi   'which pip'

#------------------------------------------------------------------------------
# 18. ABS (Arch Build System)
#------------------------------------------------------------------------------

alias mps  'makepkg -s'      # --syncdeps
alias mpi  'makepkg -si'     # --install
alias mpic 'makepkg -sic'    # --clean
alias pacu 'sudo pacman -U'  # Argument: pkgname-pkgver.pkg.tar.zst

#------------------------------------------------------------------------------
# 19. Programs
#------------------------------------------------------------------------------

#--------------------------------------
# Launching programs
#--------------------------------------

# Adhering to XDG BASE DIR spec:
alias dosbox 'dosbox -conf "${XDG_CONFIG_HOME}/dosbox/dosbox.conf"'
alias irssi  'irssi --config="${XDG_CONFIG_HOME}/irssi/config" --home="${XDG_CONFIG_HOME}/irssi"'
alias lynx   'lynx -lss="${XDG_CONFIG_HOME}/lynx/lynx.lss"'
#alias svn    'svn --config-dir "${XDG_CONFIG_HOME}/subversion"'

alias bs     'basename'
alias bl     'bluetoothctl'
alias cat    'bat'
alias e      'echo'
alias enc    'uchardet'
alias espeak 'espeak -ven-uk'
#alias f      'fzf'
alias fire   'firefox'
alias g      'grep'
alias h      'head'
alias ink    'inkscape'
alias libre  'libreoffice'
alias ls     'colorls'
#alias ls    'ls --color=auto'
alias l      'ls'
alias mann   'MANPAGER=less; man '
alias mc     'mc --nosubshell'
alias mi     'nomacs'
alias nn     'neofetch'
alias play   'mpv'
alias r      'ranger'
alias rss    'newsboat'
alias show   'sqlitebrowser'
#alias t      'tail'
alias ta     'tail'
alias t      'thunar'
alias tu     'thunar'
#alias tar    'tar -xvf'
alias tarr   'tar -xvf'
alias timer  'termdown -B | lolcat'
alias ti     'termdown -B | lolcat'
alias tl     'translit'
alias unrar  'unrar x'
alias v      '${EDITOR}'
alias vim    '${EDITOR}'
alias vmi    '${EDITOR}'
alias vv     'sudo ${EDITOR}'
# A trailing space in `xargs ` causes the next word to be checked for
# alias substitution when the alias is expanded.
alias xargs   'xargs '
alias xa      'xargs '
alias yd      'yt-dlp'
# A trailing space in `watch ` causes the next word to be checked for
# alias substitution when the alias is expanded.
#
# Usage:
# watch ple                      # OK:  alias `ple` is expanded as `pacman -Qeq`
# watch ple | grep ^z            # BAD: multiple commands, need to quote everything
# watch "ple | grep ^z"          # BAD: when quoted, aliases do not expand in this case
# watch "pacman -Qeq | grep ^z"  # OK:  no aliases inside quotes
#
# `watch -n 0` is equivalent to `watch -n 0.1`
alias watch   'watch '

#--------------------------------------
# Using programs
#--------------------------------------

# AWK
alias awk-1    'awk '\''{OFS=FS} {print $1}'\'
alias awk-2    'awk '\''{OFS=FS} {print $2}'\'
alias awk-3    'awk '\''{OFS=FS} {print $3}'\'
alias awk-4    'awk '\''{OFS=FS} {print $4}'\'
alias awk--4   'awk '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk--3   'awk '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alias awk--2   'awk '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alias awk--1   'awk '\''{OFS=FS} {print $(NF)}'\'
alias awk--    'awk '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alias awk-t-1  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $1}'\'
alias awk-t-2  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $2}'\'
alias awk-t-3  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $3}'\'
alias awk-t-4  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $4}'\'
alias awk-t--4 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-t--3 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alias awk-t--2 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alias awk-t--1 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF)}'\'
alias awk-t--  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alias awk-c-1  'awk -F: '\''{OFS=FS} {print $1}'\'
alias awk-c-2  'awk -F: '\''{OFS=FS} {print $2}'\'
alias awk-c-3  'awk -F: '\''{OFS=FS} {print $3}'\'
alias awk-c-4  'awk -F: '\''{OFS=FS} {print $4}'\'
alias awk-c--4 'awk -F: '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-c--3 'awk -F: '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alias awk-c--2 'awk -F: '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alias awk-c--1 'awk -F: '\''{OFS=FS} {print $(NF)}'\'
alias awk-c--  'awk -F: '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alias awk-s-1  'awk -F/ '\''{OFS=FS} {print $1}'\'
alias awk-s-2  'awk -F/ '\''{OFS=FS} {print $2}'\'
alias awk-s-3  'awk -F/ '\''{OFS=FS} {print $3}'\'
alias awk-s-4  'awk -F/ '\''{OFS=FS} {print $4}'\'
alias awk-s--4 'awk -F/ '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-s--3 'awk -F/ '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alias awk-s--2 'awk -F/ '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alias awk-s--1 'awk -F/ '\''{OFS=FS} {print $(NF)}'\'
alias awk-s--  'awk -F/ '\''{OFS=FS} {print $NF}'\'
#-----------------------------
alias awk-o-1  'awk -F, '\''{OFS=FS} {print $1}'\'
alias awk-o-2  'awk -F, '\''{OFS=FS} {print $2}'\'
alias awk-o-3  'awk -F, '\''{OFS=FS} {print $3}'\'
alias awk-o-4  'awk -F, '\''{OFS=FS} {print $4}'\'
alias awk-o--4 'awk -F, '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-o--3 'awk -F, '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
alias awk-o--2 'awk -F, '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
alias awk-o--1 'awk -F, '\''{OFS=FS} {print $(NF)}'\'
alias awk-o--  'awk -F, '\''{OFS=FS} {print $NF}'\'

# Colorls
alias la     'colorls -al'
alias lc     'colorls -1'
alias lsa    'colorls -a'
alias lsal   'colorls -al'
alias lsla   'colorls -al'
alias lsl    'colorls -l'
alias ih     'colorls -la | grep -i'
alias lsh    'colorls -ld .?*'
alias since  'colorls -lt | head'
alias sincee 'colorls -lt'
# Display only directories:
alias dod    'colorls -ld'
# Display only files:
alias dof    'colorls -lf'

# Cowfortune
alias cff 'fortune | cowsay'
alias cfr 'fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'

# Crontab
alias ce 'crontab -e'
alias cl 'crontab -l'

# du
alias dusort       'du -chs * | sort -h'
alias dus          'du -chs * | sort -h'
alias dusort.all   'du -chs * .* | sort -h'  # include hidden files
alias trackmem     'watch -n 5 "du -chs * | sort -h"'
alias trackmem.all 'watch -n 5 "du -chs * .* | sort -h"'

# feh
alias wall 'feh --bg-scale'

# find
alias ff        'find . -name'

# Git
alias ga    'git add'
alias gau   'git add -u .'
alias gb    'git branch'
alias gc    'git commit'
alias gco   'git commit --only'
alias gch   'git checkout'
alias gd    'git diff'
alias gdc   'git diff --cached'
alias gl    'git pull'
alias glg   'git lg'
alias gp    'git push'
alias gr    'git restore'
alias grem  'git remote -v'
alias grs   'git restore --staged'
alias gitr  'git rev-list --all --pretty=oneline -- '
alias gs    'git status'
alias clone 'git clone'
# By default, `git fetch` does not remove remote branches that
# no longer have a counterpart branch on the remote. In order
# to do that, one explicitly needs to prune the list of remote branches:
# `git fetch --prune`. This will automatically get rid of remote branches
# that no longer exist on the remote. Afterwards, `git branch --remote`
# will show an updated list of branches that really exist on the
# remote: And those one can delete using git push.
alias gfp   'git fetch --prune'
alias gaa   'git add . && git commit -m '.' && git push'
alias gcp   'git commit -m '.' && git push'
# Git bare repository for dotfiles
alias dot   '/usr/bin/git --git-dir=${HOME}/.dotfiles/ --work-tree=${HOME}'
alias dsa   'dot add'
alias dsau  'dot add -u .'
alias dsua  'dot add -u .'
alias dsc   'dot commit'
alias dsco  'dot commit --only'
alias dsd   'dot diff'
alias dsdc  'dot diff --staged'
alias dsg   'dot lg'
alias dsl   'dot pull'
alias dsp   'dot push'
alias dsr   'dot restore'
alias dsrc  'dot restore --staged'
alias dotr  'dot rev-list --all --pretty=oneline -- '
alias ds    'dot status'
alias dsu   'dot status -u .'

# GitHub CLI
alias gg 'gh copilot suggest'
alias ge 'gh copilot explain'

# Grep
alias grep       'grep --color=auto'
alias grepi      'grep -i'
alias grep.find  'grep -rHn'
alias grepi.find 'grep -i -rHn'
alias grepp      'grep -P'

# ls
#alias l     'ls'
#alias la    'ls -al'
#alias las   'ls -al'
#alias lc    'ls | cat'
#alias ll    'ls -lL'
#alias lla   'ls -lad .*'
#alias lsa   'ls -a'
#alias lsal  'ls -al'
#alias lsh   'ls -ld .?*'
#alias lsl   'ls -l'
#alias lsla  'ls -al'
#alias lsr   'ls -R'
#alias since '\ls -ltL | head'
# Display only directories:
#alias dod   '\ls -l | grep ^d'
# Display only files:
#alias dof   '\ls -l | grep ^-'

# mpv
alias mpv.image   'mpv --no-config --pause --vo=tct'
alias mpv.video   'mpv --no-config --vo=tct'
alias mpv.youtube 'mpv -vo=caca'

# Neovim
alias vib              '${EDITOR} -b'
alias vim.bare         '${EDITOR} -u NONE'
alias vim.plug.up      '${EDITOR} +PackerSync'
alias vim.plug.clean   '${EDITOR} +PackerClean'
alias vim.plug.list    '${EDITOR} +PackerStatus'

# Redshift
alias red.norm 'redshift -P -O 6500'
alias red.warm 'redshift -P -O 5000'

# Silver Searcher
alias agi          'ag -i'
alias ag.find      'ag -rs --noheading'
alias agi.find     'ag -rsi --noheading'
alias ag.find_all  'ag -rs --noheading --hidden'
alias agi.find_all 'ag -rsi --noheading --hidden'

# Scrot
alias pic 'scrot -s ${HOME}/Screenshots/screenshot-%F-%H%M%S.png'

# SSH
#alias sa   'ssh-add'
alias sl   'ssh-add -l'
alias ssid 'eval $(ssh-agent -s)'

# Subversion
# --Preview
alias s            'svn status'
alias si           'svn info'
alias sd           'svndiff'
alias sdd          'svn diff'
alias ssd          'svn diff --diff-cmd="meld"'
alias svn.log      'svn log -r 1:HEAD'
alias svn.log.head 'svn log -r HEAD:1 --limit 5'
alias slg          'svn log -r HEAD:1 --limit 5'
alias scat         'svn cat'
# --Actions
alias sa           'svn add'
alias san          'svn add -N'
alias sr           'svn revert `--use-commit-times`'
alias scc          'svn copy'
alias sm           'svn move'
alias ci           'svn commit'
alias cim          'svn commit -m'
alias sc           'confirm "svn cleanup --remove-unversioned"'
alias key          'svn propset svn:keywords "Author Date Revision URL Id"'
alias ex           'svn propset svn:executable on'
alias svn.checkout 'svn checkout `--use-commit-times`'
alias svn.up       'svn update `--use-commit-times`'
alias sup          'svn update `--use-commit-times`'
alias svn.recommit 'svn commit -F svn-commit.tmp'
alias svn.clean    'svn cleanup --remove-unversioned'

# Tmux
alias tmux.ls    'tmux ls'
alias tl         'tmux ls'
alias tmux.which "tmux display-message -p '#S'"

# wmctrl
alias win  'wmctrl -l'
alias winx 'wmctrl -lx'
alias wing 'wmctrl -l -G'

# yt-dlp
alias ydn             'yt-dlp --no-playlist'
alias yda             'yt-dlp --extract-audio'
# ^--- Extract audio from a whole playlist
alias ydna            'yt-dlp --no-playlist --extract-audio'
alias ydna3           'yt-dlp --no-playlist --extract-audio --audio-format mp3'
alias ydl-clean-cache 'yt-dlp --rm-cache-dir'

#--------------------------------------
# Killing programs
#--------------------------------------

alias kc    'killall cmus'
alias stop  'killall mpg123'
alias x.out 'killall xinit'
alias dout  'killall xinit'

#------------------------------------------------------------------------------
# 20. Configs
#------------------------------------------------------------------------------

#---------------------------------------
# Switching configs
#---------------------------------------

alias emacs.gnu  'ln -nsf ${XDG_CONFIG_HOME}/emacs-gnu ${XDG_CONFIG_HOME}/emacs'
alias emacs.doom 'ln -nsf ${XDG_CONFIG_HOME}/emacs-doom ${XDG_CONFIG_HOME}/emacs'

#---------------------------------------
# Reloading configs
#---------------------------------------

alias mkgrub       'sudo grub-mkconfig -o /boot/grub/grub.cfg'
alias mkinit       'sudo mkinitcpio -p linux'
alias xres.restart 'xrdb ${XDG_CONFIG_HOME}/X11/Xresources'
alias retmux       'tmux kill-server; tmux source-file ~/.tmux.conf; tmux'
alias reh          'rehash'
alias z            'source ${ZDOTDIR}/.zshrc'

#---------------------------------------
# Editing configs
#---------------------------------------

alias al     '${EDITOR} ${ZDOTDIR}/aliases.zsh'
alias cm     '${EDITOR} ${XDG_CONFIG_HOME}/picom/picom.conf'
alias dun    '${EDITOR} ${XDG_CONFIG_HOME}/dunst/dunstrc'
alias ee     '${EDITOR} ${XDG_CONFIG_HOME}/emacs-gnu/init.el'
alias eed    '${EDITOR} ${XDG_CONFIG_HOME}/doom/init.el'
alias fn     '${EDITOR} ${ZDOTDIR}/functions.zsh'
alias fn.fzf '${EDITOR} ${ZDOTDIR}/fzf-functions.zsh'
alias gconf  '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
alias ic     '${EDITOR} ${XDG_CONFIG_HOME}/i3/config'
alias icc    '${EDITOR} ${XDG_CONFIG_HOME}/i3blocks/config'
alias lal    '${EDITOR} ${ZDOTDIR}/aliases.local.zsh'
alias lfn    '${EDITOR} ${ZDOTDIR}/functions.local.zsh'
alias mime   '${EDITOR} ${XDG_CONFIG_HOME}/mimeapps.list'
alias rc     '${EDITOR} ${XDG_CONFIG_HOME}/openbox/rc.xml'
alias rr     '${EDITOR} ${XDG_CONFIG_HOME}/ranger/rc.conf'
alias start  '${EDITOR} ${XDG_CONFIG_HOME}/openbox/autostart'
alias tg     '${EDITOR} ${XDG_CONFIG_HOME}/tig/config'
alias tintrc '${EDITOR} ${XDG_CONFIG_HOME}/tint2/tint2rc'
alias tmuxr  '${EDITOR} ${XDG_CONFIG_HOME}/tmux/tmux.conf'
alias xi     '${EDITOR} ${XDG_CONFIG_HOME}/X11/xinitrc'
alias xres   '${EDITOR} ${XDG_CONFIG_HOME}/X11/Xresources'
alias zenv   '${EDITOR} ${ZDOTDIR}/.zshenv'
alias zr     '${EDITOR} ${ZDOTDIR}/.zshrc'

#------------------------------------------------------------------------------
# 21. Window manager-specific
#------------------------------------------------------------------------------

#---------------------------------------
# i3
#---------------------------------------

alias i3.out       'i3-msg exit'
alias i3.notes     'i3-msg exec "urxvt -name notes -hold -e zsh -c ${BIN}/vimnotes"'
alias cmus.run     'urxvt -name dropdown_aux -e tmux new-session cmus &'
alias cmus.scratch "i3-msg 'exec --no-startup-id urxvt -name dropdown_aux -e tmux new-session cmus\;'"
# Avoid tmux session using an old I3SOCK environment variable after i3 restart
# Run this instead of `i3-msg` while in tmux
alias i3-msg-tmux  'i3-msg --socket "${XDG_RUNTIME_DIR}/i3/$(\ls -t ${XDG_RUNTIME_DIR}/i3/ | awk "{OFS=FS} {print $1}" | grep ipc | head -n 1)"'

#---------------------------------------
# Openbox
#---------------------------------------

alias autostart    '${XDG_CONFIG_HOME}/openbox/autostart'
alias op.out       'openbox --exit'
alias theme.matrix '${BIN}/themes/matrix/run'
alias theme.riddle '${BIN}/themes/riddle/run'
alias f2on         'openbox-enable-F2-keybinding'
alias f2of         'openbox-disable-F2-keybinding'
alias reop         'openbox --reconfigure'

#------------------------------------------------------------------------------
# 22. Aliases to Zsh functions
#------------------------------------------------------------------------------

alias fe   'edit-file'
alias fea  'edit-file --hidden'
alias f    'fieldc tab'
alias cols 'colv tab'
alias hs   'https_to_ssh'
alias tc   'tmux-clean'

#------------------------------------------------------------------------------
# 23. Aliases to scripts
#------------------------------------------------------------------------------

alias setx   'fix-xkbmap'
alias 12on   'gtk3-enable-12px-font'
alias 12of   'gtk3-disable-12px-font'
alias thanks '(${BIN}/sounds/thanks-hal &) > /dev/null'

#------------------------------------------------------------------------------
# 24. Aliases as flags
#------------------------------------------------------------------------------

# Usage: command `--use-commit-times`
alias --use-commit-times 'echo --config-option=config:miscellany:use-commit-times=yes'
alias --date             'date "+%F"'
alias --datetime         'date +%F_%H_%M_%S'
alias --retrieved        'date '\''+%F %H:%M'\'''
alias --datecomment      'date "+#DATE: %F %T %Z"'
alias --time             'date +%H:%M:%S'

#------------------------------------------------------------------------------
# 25. Programming
#------------------------------------------------------------------------------

#---------------------------------------
# Languages
#---------------------------------------

# Python
alias p         'python'
alias pi        'ipython --TerminalInteractiveShell.editing_mode=vi'
alias py.exe    'python -c'
alias qenv      'deactivate'
alias venv.init 'python3 -m venv venv'
alias venv      'source venv/bin/activate'
alias tre       'tree -I "venv|__pycache__"'

# C
alias gdb.super 'gdb --batch --ex run --ex bt --ex q --args'
alias vl        'valgrind'
alias vll       'vlt --leak-check=full --show-leak-kinds=all'
alias vllv      'vlt --leak-check=full --show-leak-kinds=all -v'
alias vlt       'valgrind --track-origins=yes --leak-check=full'
alias vt        'valgrind --track-origins=yes'

#---------------------------------------
# Frameworks
#---------------------------------------

# Django
alias pmp  'python manage.py'
alias runs 'python manage.py runserver'
alias mig  'pmp makemigrations && pmp migrate'

#---------------------------------------
# Databases
#---------------------------------------

alias mg  'mysql -u root -p'
alias mgu 'mysql -u user -p'
alias pg  'sudo -iu postgres psql postgres'

#------------------------------------------------------------------------------
# 26. Misc
#------------------------------------------------------------------------------

# Count files in the directory:
alias cf        'setopt CSH_NULL_GLOB; files=(*); echo ${#files[@]};'
# Count only hidden files in the directory:
alias cfa       'setopt CSH_NULL_GLOB; files=(.*); echo ${#files[@]};'
# Count directories:
alias cfd       'setopt CSH_NULL_GLOB; dirs=(*/); echo ${#dirs[@]};'
alias empty     'truncate -s 0'
alias fld       'fold -w 80 -s'
alias immutable 'sudo chattr +i'
alias mutable   'sudo chattr -i'
alias prun      'perldoc perlrun'  # Similar text can be shown with `man perlrun`
alias rl        'readlink -f'
alias rows      'tr "\\n" " "'  # Used in a pipe, ... | rows
alias tag       'ctags -R .'
alias wl        'wc -l'
alias xres.show 'xrdb -query -all'

#------------------------------------------------------------------------------
# 27. Temporary (maybe they will stick)
#------------------------------------------------------------------------------

alias books    '${EDITOR} -c "e ${PRO}/2022/books/bibliography.bib | :cd %:p:h"'
alias get.date '--datetime | tr -d '\n' | copy'
alias pasta    '${EDITOR} "${DOTSHARE}/misc/pastes.lst"'
alias pst      'cd ${PRO}/2022/npBuild && ./packageStats'
alias sg       'cd ${MP1}/SG_shell_settings'
alias xav      'xargs ${EDITOR}'
alias dq       'cd ${MP1}/dataquest'
alias irc      '${EDITOR} "${XDG_CONFIG_HOME}/ideavim/ideavimrc"'
