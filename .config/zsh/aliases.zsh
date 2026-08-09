# vim: set ft=zsh tw=88 nu ai et ts=2 sw=2:
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-09 02:17:59 CEST
# Path:   ~/.config/zsh/aliases.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
#
# Nota bene:
# -----------------
# Zsh, unlike Bash, expands aliases recursively
# (definition order doesn't matter):
#     alias a="b X"; alias b="echo Y"
#     a → b X → echo Y X
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
#  27. Temporary aliases

# Keep this function available: dynamically added aliases use it.
def() {
  builtin alias -- "${1}=${2}"
}

#------------------------------------------------------------------------------
# 1. Navigation
#------------------------------------------------------------------------------

# Going up ('c' is a custom Shell function)
#def up    'c ..'
def ./    'c ..'
def ..    'c ..'
def ...   'c ../..'
def ....  'c ../../..'
def ..... 'c ../../../..'
def -     'c "${OLDPWD}"'
def c-    'c "${OLDPWD}"'
def cd    'echo "*** Use '\'"c"\'' ***"'

# Temporary directories
def mp  'c ${MP} '
def mp1 'c ${MP1}'
def mp2 'c ${MP2}'
def mp3 'c ${MP3}'
def mp4 'c ${MP4}'
def mp5 'c ${MP5}'
def mp6 'c ${MP6}'
def mp7 'c ${MP7}'
def mp8 'c ${MP8}'
def mp0 'c ${MP0}'
def tmp 'c /tmp'

# Various locations
def apps     'c ${XDG_DATA_HOME}/applications'
def bak      'c ${HOME}/backups'
def bin      'c ${BIN}'
def bit      'c ${PRO}/BIT'
def bu       'c ${MP1}/budget && venv'
def cache    'c ${XDG_CACHE_HOME}'
def can      'c ${CANDY}'
def conf     'c ${XDG_CONFIG_HOME}'
def confs    'c ${XDG_CONFIG_HOME}/nvim/lua/plugins'
def cor      'c ${XDG_CONFIG_HOME}/R'
def dat      'c ${XDG_DATA_HOME}'
def data     'c ${XDG_DATA_HOME}'
def dots     'c ${DOTSHARE}'
def dq       'c ${MP1}/dataquest'
def drop     'c ${DROPBOX}'
def drop.bak 'c ${DROPBOX}/backups'
def dw       'c ${XDG_DOWNLOAD_DIR}'
def fin      'c ${PRO}/finances'
def hist     'c ${HOME}/histfiles/'
def key      'c ${PRO}/keyword_tracker'
def lab      'c ${XDG_CONFIG_HOME}/labwc'
def lok      'c ${HOME}/.local'
#def n        'c ${NOTES}'
def notes    'c ${NOTES}'
def np       'c ${PRO}/archived/2022/npBuild'
def op       'c ${XDG_CONFIG_HOME}/openbox'
def plugs    'c ${XDG_CONFIG_HOME}/nvim/lua/plugins'
def pro      'c ${PRO}'
def res      'c ${XDG_DATA_HOME}/tmux/resurrect'
def sg       'c ${MP1}/SG_shell_settings'
def share    'c ${XDG_DATA_HOME}'
def sk       'c ${SCREENSHOTS}'
def sol      'c ${PRO}/archived/2023/Solutions-To-Problems/Codewars'
def state    'c ${XDG_STATE_HOME}'
def tra      'c ${PRO}/transcribe'
def tem      'c ${PRO}/archived/2023/Solutions-To-Problems/Codewars/temp'
def vid      'c ${XDG_VIDEOS_DIR}'
def vids     'c ${XDG_VIDEOS_DIR}'
def was      'c ${HOME}/wastebasket'
def we       'c ${MP1}/webuzz && venv'
def ws       'c ${HOME}/wastebasket'
def zdot     'c ${ZDOTDIR}'

#------------------------------------------------------------------------------
# 2. Getting information
#------------------------------------------------------------------------------

# Hostname and path
def host 'echo ${HOST}'
def path 'echo ${PATH} | tr ":" "\n"'

# Disk info
def ddf 'df -hP | rg ^/'
def fl  'sudo fdisk -l'
def lf  'lsblk -f'

# Video info
def gpu.load   'command watch -n 1 nvidia-smi'
def gpu.which  'glxinfo | rg "OpenGL vendor|OpenGL renderer"'
def info.video 'lspci | rg -e VGA -e 3D'

# Window info
def get.win_class    'xprop | rg -i class'
def get.win_pos_size 'xwininfo'
def getpos           'xwininfo -id $(xdotool getactivewindow)'
def get.pc_specs     'inxi -Fxxxz'

# Keyboard keys info
def get.key_code_1 'sed -n l'
def get.key_code_2 'showkey --ascii'
def get.keyname    'xev'
# ^--press keys and Enter (`cat` also can be used)

# Subversion info
def mydata \
  'whoami; pwd; hostname -f; test -d .svn && svnversion; test -d .svn '\
'&& svn info; date'

#------------------------------------------------------------------------------
# 3. Standard commands
#------------------------------------------------------------------------------

def m      'mv'
def smv    'sudo mv'
#def scp    'sudo cp -r'
def srm    'sudo rm -r'
def cprf   'sudo cp -r'
def dir    'vidir'
def dir-   'vidir -'
def r      'rm -i'
def w      'which'
def rehist 'fc -R'
def diff   'diff --color=auto'
def cutc   'cut -b 1-${COLUMNS}'
def ls     'echo "*** Use '\'"l"\'' ***"'
#def cat    'echo "*** Use '\'"ca"\'' ***"'
def cat    'bat'
def exit   'echo "*** Use '\'"q"\'' ***"'
def caa    'command cat'
def x      'clear'
def cls    'clear'
def q      'builtin exit'
#def h      'history'
#def j      'jobs'
#def j      'journalctl -xe'
#def cp     'cp -i'
def md     'mkdir'
def mdir   'mkdir'
#def mv     'mv -i'
def more   'less'
#def m      'less'
def re     'reboot'
def off    'poweroff'
def pd     'pushd'
def pop    'popd'
def prego  'sudo $(fc -ln -1)'
def cpr    'cp -r'
def rd     'rmdir'
def rmr    'rm -rf'
def rmrf   'sudo rm -r'

#------------------------------------------------------------------------------
# 4. Modifying shell behavior
#------------------------------------------------------------------------------

def show-hidden 'setopt -s glob_dots'

#------------------------------------------------------------------------------
# 5. Permissions
#------------------------------------------------------------------------------

def exe   'chmod +x'
def ex    'chmod +x'
def noexe 'chmod -x'
def noex  'chmod -x'
def lets  'chmod 755'
def letr  'chmod -R 755'
def ch    'sudo chown -R ${USER}:${USER}'

#------------------------------------------------------------------------------
# 6. Clipboard
#------------------------------------------------------------------------------

def copy       'xclip -selection clipboard'
def ll         'xclip -selection clipboard'
def xclip.clip 'xclip -selection clipboard'
def xclip.prim 'xclip -selection primary'
def clip.1     'xclip -o -selection primary'
def xclip.sec  'xclip -selection secondary'
def clip.2     'xclip -o -selection clipboard'

#------------------------------------------------------------------------------
# 7. Fonts
#------------------------------------------------------------------------------

def fonts.current 'fc-match --verbose Sans'
def fonts.list    "fc-list ':' file"
def fonts.find    'fc-list | rg -i'
def fonts.match   'fc-match'
def fonts.update  'fc-cache -fv'

#------------------------------------------------------------------------------
# 8. Keyboard layouts
#------------------------------------------------------------------------------
#
def lt 'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt'
# ^-- Choosing 'lt' also resets languages to the usual 'us,lt' combination
def de 'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,de'
def es 'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,es'
#def he 'setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il'
def ru \
  "setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle -layout "\
"'us,lt,ru' -variant ',,phonetic'"
def emacs.caps   'setxkbmap -option && set-keyboard-layout'
def emacs.nocaps 'setxkbmap -option ctrl:nocaps'
def nocaps 'sudo dumpkeys | sed "s/\s*58\s*=\s*Caps_Lock/ 58 = Control/" | sudo loadkeys'

#------------------------------------------------------------------------------
# 9. Screen brightness
#------------------------------------------------------------------------------

def xminus 'light -U 10'
def xplus  'light -A 10'

#------------------------------------------------------------------------------
# 10. Sound
#------------------------------------------------------------------------------

def aminus 'amixer set Master 10%-'
def aplus  'amixer set Master 10%+'
def mute   'amixer -q sset Master toggle'

#------------------------------------------------------------------------------
# 11. Clock and time
#------------------------------------------------------------------------------

def clock.sync      'sudo ntpd -qg'
def get.date        '--datetime | tr -d "\n" | copy'
def timezone.update 'timedatectl set-timezone "$(curl --fail https://ipapi.co/timezone)"'

#------------------------------------------------------------------------------
# 12. Systemd
#------------------------------------------------------------------------------

# General
def systemd.boot       'systemd-analyze blame'
def systemd.boot_total 'systemd-analyze time'
def systemd.enabled    'systemctl list-unit-files | rg enabled'
def systemd.enabled.2 \
  'find /etc/systemd -type l -exec test -f {} \; -print | awk -F'\
\''/'\'' '\''{ printf ("%-40s | %s\n", $(NF-0), $(NF-1)) }'\
\'' | sort -f'
# ^--- Kudos to seth! (https://bbs.archlinux.org/profile.php?id=63451)
def systemd.list       'systemctl list-unit-files'
def systemd.running    'systemctl --type=service'

# Databases
def most 'systemctl start mongodb'
def myst 'systemctl start mysqld'
def mast 'systemctl start mariadb'
def post 'systemctl start postgresql'

# Servers
def apache   'systemctl start httpd.service'
def reapache 'systemctl restart httpd'

# Wired
def net     "systemctl start dhcpcd@$(basename -a /sys/class/net/enp*).service"
def renet   "systemctl restart dhcpcd@$(basename -a /sys/class/net/enp*).service"
#def net     "sudo dhcpcd $(basename -a /sys/class/net/enp*)"
#def renet \
#  "sudo dhcpcd -k $(basename -a /sys/class/net/enp*) && sudo dhcpcd "\
#"$(basename -a /sys/class/net/enp*)"
def lan.on  "sudo ip link set $(basename -a /sys/class/net/enp*) up"
def lan.off "sudo ip link set $(basename -a /sys/class/net/enp*) down"

# Wireless
def wnet     "systemctl start dhcpcd@$(basename -a /sys/class/net/wlp*).service"
def rewnet   "systemctl restart dhcpcd@$(basename -a /sys/class/net/wlp*).service"
#def wnet     "sudo dhcpcd $(basename -a /sys/class/net/wlp*)"
#def rewnet \
#  "sudo dhcpcd -k $(basename -a /sys/class/net/wlp*) && sudo dhcpcd "\
#"$(basename -a /sys/class/net/wlp*)"
def wifi.on  "sudo ip link set $(basename -a /sys/class/net/wlp*) up"
def wifi.off "sudo ip link set $(basename -a /sys/class/net/wlp*) down"

#------------------------------------------------------------------------------
# 13. Network
#------------------------------------------------------------------------------

def pp                'ping -c 3 www.google.com'
def pwp               'command watch -n 0.5 "ping -c 3 www.google.com"'
def check.ip          'whois'
def check.dns         'nslookup'
def check.domain      'whois'
def get.my_ip         'curl -w "\n" ifconfig.me'
def get.local_ip      'ip route --color=always | head -n 1'
def get.gateway       'ip route --color=always | head -n 1'
# Get the current active interface name
def get.net_interface 'ip route --color=always | head -n 1'

#------------------------------------------------------------------------------
# 14. WPA Supplicant
#------------------------------------------------------------------------------

def wpa.home   "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/home.conf"
def wpa.iphone "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/iphone.conf"
def wpa.wpa    "sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/wpa_supplicant.conf"

#------------------------------------------------------------------------------
# 15. Mount/Unmount
#------------------------------------------------------------------------------

def phone.on  'ifuse ${HOME}/iPhone'  # If problems, remount + restart thunar
def phone.off 'fusermount -u ${HOME}/iPhone'

#------------------------------------------------------------------------------
# 16. Process Management
#------------------------------------------------------------------------------

def ka  'killall'
def kil 'kill -9'

def det 'bg && disown'

# `ps -e` displays every active process on a Linux system in Unix format
def ae 'ps -e | rg -v " rg$" | rg -i'
#     Use `ps c -ef` for simple name of executable (and showing process status)

# '-f' performs a full-format listing
def aef 'ps -ef | rg -v "[[:space:]]rg( |$)" | tee >(head -n1) | rg -i'

# Another way of listing (shows session id)
def aes \
  "ps -e -o user,pid,pgid,sess,args | rg -v '[[:space:]]rg( |$)' | tee "\
">(head -n1) | rg -i"

# Display all processes in BSD format
#     'a' option displays the processes belonging to every user
#     'x' option tells ps to show all the processes regardless of what terminal
#         (if any) they are controlled ('?" in TTY column indicated no
#         controlling terminal)
def au 'ps ax | rg -v "^[ ]*[0-9]+.* rg( |$)" | rg -i'
#     Use `ps cax` for simple name of executable (and showing process status)

#     'u' option is for user-oriented format
def aux "ps aux | rg -v '\brg\b' | rg -i"

# Also show parent PID
def aup 'ps ax l | rg -v "^[ ]*[0-9]+.* rg( |$)" | rg -i'

# Show sleeping processes
def asleep 'ps ax | rg -v "^[ ]*[0-9]+.* rg( |$)" | rg -- sleep'

# fuser -v {file/socket name(s)} - show info about process, working with the
# file(s)/socket(s)
def fuserv 'fuser -v'

# fuser -vk {file/socket name(s)} - kill the process working with the
# file(s)/socket(s)
# E.g. usage: fuser -vk *.log
def fuserk 'fuser -vk'

#------------------------------------------------------------------------------
# 17. Package management
#------------------------------------------------------------------------------

#---------------------------------------
# npm
#---------------------------------------

def n        'npm'
def npm.ls   'npm list --depth=0'
def npm.ls.g 'npm list -g --depth=0'

#---------------------------------------
# Pacman
#---------------------------------------

#------------------
# -Q flag
#------------------

def orphans             'pacman -Qdtq'
def is                  'pacman -Qeq | rg -i'                      # Grep for explicitly installed package (package 'is' in the system)
def isa                 'pacman -Qq | rg -i'                       # Grep for installed package ('isa' = 'is -a' as in 'ls -a', with 'implicitly installed packages' as 'hidden files')
def visa                'pacman -Q --color=always | rg -i'         # Grep for installed package with version info ('visa' = 'is -a -v')
def pla                 'pacman -Qq   | sort'                      # List all installed packages
def ple                 'pacman -Qeq  | sort'                      # List all explicitly installed packages
def pld                 'pacman -Qdq  | sort'                      # List all packages installed as dependencies
def pln                 'pacman -Qnq  | sort'                      # List all native packages
def plm                 'pacman -Qmq  | sort'                      # List all foreign packages
def plne                'pacman -Qqen | sort'                      # List all native explicitly installed packages
def plnd                'pacman -Qqdn | sort'                      # List all native packages installed as dependencies
def plme                'pacman -Qemq | sort'                      # List all foreign explicitly installed packages
def plmd                'pacman -Qdmq | sort'                      # List all foreign packages installed as dependencies
def pac.owner           'pacman -Qo'                               # Which package owns the specified file(s)
def paco                'pacman -Qo'                               # Which package owns the specified file(s)
def pac.owned_files     'pacman -Qlq'                              # List of files owned by the specified package
def pac.group           'pacman -Qgq'                              # List installed packages belonging to a group (or list all groups and packages if no argument is passed)
def pac.group.belongs   'pacman -Qgq | rg -i'                      # Show which group the installed package belongs to
def pac.base            'a_and_b <(pac.base_remote) <(pla)'        # List installed packages depending on `base` metapackage
def pac.base-devel      'a_and_b <(pac.base-devel_remote) <(pla)'  # List installed packages depending on `base-devel` metapackage
def pac.info            'pacman -Qi'                               # Display info on a given installed package
def pac.search          'pacman -Qs'                               # Search each installed package for names or descriptions that match regexp
def pac.check_files     'pacman -Qk'                               # For all installed pkgs, check that all files owned by the given package(s) are present on the system.
def pac.check_files_det 'pacman -Qkk'                              # More detailed checking (+ permissions, file sizes, and modification times) for pkgs that contain the needed mtree file.

#------------------
# -R flag
#------------------

def pacr         'sudo pacman -Rns'
def freeorphans  'sudo pacman -Rns $(pacman -Qdtq)'
def free         'sudo pacman -Rns $(pacman -Qdtq)'
# Avoid using the -d option with pacman. pacman -Rdd package skips dependency
# checks during package removal.
# As a result, a package providing a critical dependency could be removed,
# resulting in a broken system.
def pac.forcedel 'sudo -k pacman -Rdd'

#------------------
# -S flag
#------------------

def pacfile               'sudo pacman -S --noconfirm - --needed <'      # Install from file
def pacs                  'sudo pacman -S --noconfirm --needed'          # `needed` does not reinstall targets that are up to date
def pac.group_remote      'pacman -Sgq'                                  # List packages from sync database belonging to a group
def pac.base_remote       'expac -S '%E' base | command xargs -n1 | sort'        # List packages from sync database depending on `base` metapackage
def pac.base-devel_remote 'expac -S '%E' base-devel | command xargs -n1 | sort'  # List packages from sync database depending on `base-devel` metapackage
def pac.info_remote       'pacman -Si'                                   # Display info on a given sync database package
def pac.info_remote_full  'pacman -Sii'                                  # ^--- and also display those packages in all repos that depend on this package.
def pac.search_remote     'pacman -Ss'                                   # Search each package from sync database for names or descriptions that match regexp
# Removes uninstalled packages from /var/cache/pacman/pkg and cleans unused
# repos in /var/lib/pacman
def pac.clear             'sudo pacman -Sc'
# Removes ALL packages from /var/cache/pacman/pkg and ...
def pac.clear_all         'sudo pacman -Scc'
# Fuzzy-search through all available packages, with package info shown in a
# preview window, and then install selected packages
def fzf.pac \
  'pacman -Slq | fzf -m --preview '\
pacman -Si {1}\
' | command xargs -ro sudo pacman -S'
# -------------------------------------------------------------------------
# Updates the pkg databases if the repositories haven’t been checked recently,
# and upgrades any new package versions.
# -y -> update
# -u -> upgrade
def up                    'sudo pacman -Syu'
# Forces updates of the databases for all repositories (even if it was just
# updated recently) and upgrades any new package versions.
def up1                   'sudo pacman -Syyu'
# Upgrades packages and also downgrades packages (if one happens to have a
# newer version than in the repository). Normally this should not be used. Only
# if one is trying to fix a specific issue due to a new package being removed
# from the repository.
def up2                   'sudo pacman -Syuu'
# -------------------------------------------------------------------------

#---------------------------------------
# Paru
#---------------------------------------

def parup     'command paru'
def paru      'paru --bottomup'
def parus     'command paru -S'   # Install a package from AUR
def paru.info 'command paru -Si'  # Display info on a given installed package
def parug     'command paru -G'   # Download PKGBUILD & other files for package
# Fuzzy-search through the AUR, preview info and install selected packages
def fzf.paru \
  'command paru -Slq | fzf -m --preview "command paru -Si {1}" | '\
'command xargs -ro paru -S --noconfirm'

#---------------------------------------
# PIP
#---------------------------------------

def pii   'pip install'
def pipir 'pip uninstall'
def pir   'pip install -r requirements.txt'
def pif   'pip freeze > requirements.txt'
def piu   'pip install --upgrade pip'
def wpi   'which pip'

#------------------------------------------------------------------------------
# 18. ABS (Arch Build System)
#------------------------------------------------------------------------------
def mpo  'makepkg -o'      # --nobuild (only extract sources, don't build yet)
def mpe  'makepkg -e'      # --noextract (reuse the extracted sources, so the
                           #   changes stay in place)
def mps  'makepkg -s'      # --syncdeps
def mpi  'makepkg -si'     # --install
def mpic 'makepkg -sic'    # --clean
def pacu 'sudo pacman -U'  # Argument: pkgname-pkgver.pkg.tar.zst

#------------------------------------------------------------------------------
# 19. Programs
#------------------------------------------------------------------------------

#--------------------------------------
# Launching programs
#--------------------------------------

# Adhering to XDG BASE DIR spec:
def dosbox 'command dosbox -conf "${XDG_CONFIG_HOME}/dosbox/dosbox.conf"'
def irssi \
  'command irssi --config="${XDG_CONFIG_HOME}/irssi/config" '\
'--home="${XDG_CONFIG_HOME}/irssi"'
def lynx   'command lynx -lss="${XDG_CONFIG_HOME}/lynx/lynx.lss"'
#def svn    'command svn --config-dir "${XDG_CONFIG_HOME}/subversion"'

def '??'   'copilot -i'
def b      'bat'
def bl     'bluetoothctl'
def bro    'command bro 2>/dev/null'
def bs     'basename'
def ca     'bat'
def calc   'qalc'
def dif    'nvim -d'
def down   'sudo downgrade'
def e      'echo'
def enc    'uchardet'
def espeak 'command espeak -ven-uk'
#def f      'fzf'
def fire   'firefox'
def g      'glow'
def go     'xdg-open'
def gonull 'xdg-open &> /dev/null'
def h      'head'
def i      'cheat -c'
def ink    'inkscape'
def j      'z'  # zoxide
def k      'kubectl'
def lg     'lazygit'
def libre  'libreoffice'
def mann   'MANPAGER=less; man '
#def m      'marker-pdf'
def mc     'mc --nosubshell'
def me     'meld'
def mi     'nomacs'
def ms     'mongosh'
def nn     'neofetch'
def nv     '${EDITOR} -u NONE'
def o      'thunar'
def p3     'python3.13'
def play   'mpv'
#def r      'ranger'
def ra     'ranger'
def rss    'newsboat'
def sc     'shellcheck'
def show   'sqlitebrowser'
def t      'tail'
def ta     'tail'
#def tar    'tar -xvf'
def tarr   'tar -xvf'
#def th     'thunar'
def ti     'termdown -B | lolcat'
def timer  'termdown -B | lolcat'
def tl     'translit'
def tre    '\tree'
def tt     'thunar'
def tu     'thunar'
def unrar  'unrar x'
def v      '${EDITOR}'
def vim    '${EDITOR}'
def vmi    '${EDITOR}'
def vv     'sudo -E ${EDITOR}'
def y      'yazi'
def ynab   'NODE_OPTIONS="--no-deprecation" ynab'
# A trailing space in `xargs ` causes the next word to be checked for alias
# substitution when the alias is expanded.
def xargs  'command xargs '
def xa     'command xargs '
def yd     'yt-dlp'
# A trailing space in `watch ` causes the next word to be checked for alias
# substitution when the alias is expanded.
#
# Usage:
# watch ple                    # OK:  alias `ple` is expanded as `pacman -Qeq`
# watch ple | rg ^z            # BAD: many commands, need to quote everything
# watch "ple | rg ^z"          # BAD: when quoted, aliases do not expand now
# watch "pacman -Qeq | rg ^z"  # OK:  no aliases inside quotes
#
# `watch -n 0` is equivalent to `watch -n 0.1`
def watch  'command watch '

#--------------------------------------
# Using programs
#--------------------------------------

# AWK
def awk-1    'awk '\''{OFS=FS} {print $1}'\'
def awk-2    'awk '\''{OFS=FS} {print $2}'\'
def awk-3    'awk '\''{OFS=FS} {print $3}'\'
def awk-4    'awk '\''{OFS=FS} {print $4}'\'
def awk--4   'awk '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
def awk--3   'awk '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
def awk--2   'awk '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
def awk--1   'awk '\''{OFS=FS} {print $(NF)}'\'
def awk--    'awk '\''{OFS=FS} {print $NF}'\'
#-----------------------------
def awk-t-1  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $1}'\'
def awk-t-2  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $2}'\'
def awk-t-3  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $3}'\'
def awk-t-4  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $4}'\'
def awk-t--4 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
def awk-t--3 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
def awk-t--2 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
def awk-t--1 'awk -F$'\''\t'\'' '\''{OFS=FS} {print $(NF)}'\'
def awk-t--  'awk -F$'\''\t'\'' '\''{OFS=FS} {print $NF}'\'
#-----------------------------
def awk-c-1  'awk -F: '\''{OFS=FS} {print $1}'\'
def awk-c-2  'awk -F: '\''{OFS=FS} {print $2}'\'
def awk-c-3  'awk -F: '\''{OFS=FS} {print $3}'\'
def awk-c-4  'awk -F: '\''{OFS=FS} {print $4}'\'
def awk-c--4 'awk -F: '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
def awk-c--3 'awk -F: '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
def awk-c--2 'awk -F: '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
def awk-c--1 'awk -F: '\''{OFS=FS} {print $(NF)}'\'
def awk-c--  'awk -F: '\''{OFS=FS} {print $NF}'\'
#-----------------------------
def awk-s-1  'awk -F/ '\''{OFS=FS} {print $1}'\'
def awk-s-2  'awk -F/ '\''{OFS=FS} {print $2}'\'
def awk-s-3  'awk -F/ '\''{OFS=FS} {print $3}'\'
def awk-s-4  'awk -F/ '\''{OFS=FS} {print $4}'\'
def awk-s--4 'awk -F/ '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
def awk-s--3 'awk -F/ '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
def awk-s--2 'awk -F/ '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
def awk-s--1 'awk -F/ '\''{OFS=FS} {print $(NF)}'\'
def awk-s--  'awk -F/ '\''{OFS=FS} {print $NF}'\'
#-----------------------------
def awk-o-1  'awk -F, '\''{OFS=FS} {print $1}'\'
def awk-o-2  'awk -F, '\''{OFS=FS} {print $2}'\'
def awk-o-3  'awk -F, '\''{OFS=FS} {print $3}'\'
def awk-o-4  'awk -F, '\''{OFS=FS} {print $4}'\'
def awk-o--4 'awk -F, '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
def awk-o--3 'awk -F, '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
def awk-o--2 'awk -F, '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
def awk-o--1 'awk -F, '\''{OFS=FS} {print $(NF)}'\'
def awk-o--  'awk -F, '\''{OFS=FS} {print $NF}'\'
#-----------------------------
def awk-p-1  'awk -F. '\''{OFS=FS} {print $1}'\'
def awk-p-2  'awk -F. '\''{OFS=FS} {print $2}'\'
def awk-p-3  'awk -F. '\''{OFS=FS} {print $3}'\'
def awk-p-4  'awk -F. '\''{OFS=FS} {print $4}'\'
def awk-p--4 'awk -F. '\''{OFS=FS} {print $((NF-1)&&(NF-2)?NF-3:0)}'\'
def awk-p--3 'awk -F. '\''{OFS=FS} {print $(NF-1?NF-2:0)}'\'
def awk-p--2 'awk -F. '\''{OFS=FS} {print $(NF?NF-1:0)}'\'
def awk-p--1 'awk -F. '\''{OFS=FS} {print $(NF)}'\'
def awk-p--  'awk -F. '\''{OFS=FS} {print $NF}'\'

# Colorls
#def colorls '\colorls ${COLORLS_COLOR}'
#def ls      'colorls'
#def l       'colorls'
#def la      'colorls -al'
#def las     'colorls -al'
#def lc      'colorls -1'
#def ll      'colorls -lA --report'
#def lsa     'colorls -a'
#def lsal    'colorls -al'
#def lsla    'colorls -al'
#def lsl     'colorls -l'
#def ih      '\colorls -al ${COLORLS_COLOR_ALWAYS} | rg -i'
#def lsh     'colorls -ld .[^.]*'
#def lsr     'colorls --T'
#def since   '\colorls -lt ${COLORLS_COLOR_ALWAYS} | head'
#def sincee  '\colorls -lt
# Display only directories:
#def dod     'colorls -ld'
#def dod2    'colorls -d1'
# Display only files:
#def dof     'colorls -lf'
#def dof2    'colorls -f1'
# Display only hidden directories:
#def dohd    'colorls -lAd .[^.]*/'
#def dohd2   'colorls -Ad1 .[^.]*/'
# Display only hidden files:
#def doh     "colorls -lA | awk '\$NF ~ /^\.[^/]*$/ { print }'"
#def doh2    "colorls -1A | awk '\$NF ~ /^\.[^/]*$/ { print }'"

# Cowfortune
def cff 'fortune | cowsay'
def cfr 'fortune -c | cowthink -f $(fd -t f /usr/share/cows | shuf -n 1)'

# Crontab
def ce 'crontab -e'
def cl 'crontab -l'

# Docker
#def d  'sudo docker'
def di 'sudo docker images'
def dv 'sudo docker volume ls'
def dn 'sudo docker network ls'

# du
def dusort       'du -chs -- * | sort -h'
def dus          'du -chs -- * | sort -h'
def dusort.all   'du -chs -- * .* | sort -h'  # include hidden files
def trackmem     'command watch -n 5 "du -chs -- * | sort -h"'
def trackmem.all 'command watch -n 5 "du -chs -- * .* | sort -h"'

# eza
def eza    'command eza ${EZA_COLOR}'
def l      'eza'
def la     'eza -al'
def las    'eza -al'
def lc     'eza -1'
def lcd    'eza -1D'
def lsd    'eza -1D'
def lca    'eza -a1'
def lcad   'eza -a1D'
def lac    'eza -a1'
def lacd   'eza -a1D'
# b = bare, not formatted
def lcb    'command ls | col'
def lcab   'command ls -a | col'
def lacb   'command ls -a | col'
#def ll     'eza -lX'
#def lsa    'eza -a'
def lsal   'eza -al'
def lsla   'eza -al'
def lsl    'eza -l'
#def ll     'eza -l'
def ih     'command eza -al ${EZA_COLOR_ALWAYS} ${EZA_ICONS_ALWAYS} | rg -i'
def lsh    'eza -ld .[^.]*'
def lsr    'eza -T'
def since  'command eza --sort=oldest -l ${EZA_COLOR_ALWAYS} ${EZA_ICONS_ALWAYS} | head'
def sincee 'command eza --sort=oldest -l'
# Display only directories:
def dod    'eza -lD --classify=auto'
def dod2   'eza -D1 --classify=auto'
# Display only files:
def dof    'eza -lf'
def dof2   'eza -f1'
# Display only hidden directories:
def dohd   'eza -ld .[^.]*/ --classify=auto'
def dohd2  'eza -d1 .[^.]*/ --classify=auto'
# Display only hidden files:
def doh    'eza -lfa ${EZA_ICONS_ALWAYS} | rg "^\."'
def doh2   'eza -fa | rg "^\."'
def tree   'eza -T'

# feh
def wall 'feh --bg-scale'

# Git
def ga         'git add'
def gap        'git add -p'
def gau        'git add -u .'
def gb         'git branch'
def gc         'git commit'
def gm         "git commit -m '"
def gco        'git commit --only'
def gch        'git checkout'
def gd         'git diff'
def gd.        'git diff .'
def gdc        'git diff --cached'
def gl         'git pull'
def glg        'git lg'
def glh        'git lg --color=always | head -n 15'
def gp         'git push'
def gr         'git restore'
def grem       'git remote -v'
def grs        'git restore --staged'
def grc        'git rm -r --cached'
def gitr       'git rev-list --all --pretty=oneline -- '
def gs         'git status'
def gs.        'git status .'
def s.         'git status .'
def gcl        'git clean -f'
def gcl.here   'git clean -fdx -- .'
def gpf        'git push --force'
def gpu        'git push --set-upstream origin main'
def gpp        'git push origin main && git push github main'
def empty-push 'git add . && git commit -m "." && git push'
#def clone      'git clone'
# By default, `git fetch` does not remove remote branches that no longer have a
# counterpart branch on the remote. In order to do that, one explicitly needs
# to prune the list of remote branches: `git fetch --prune`. This will
# automatically get rid of remote branches that no longer exist on the remote.
# Afterwards, `git branch --remote` will show an updated list of branches that
# really exist on the remote: And those one can delete using git push.
def gfp        'git fetch --prune'
def gaa        'git add . && git commit -m '.' && git push'
def gcp        'git commit -m '.' && git push'
# Git bare repository for dotfiles
#def dot        '/usr/bin/git --git-dir=${HOME}/.dotfiles/ --work-tree=${HOME}'
def dotalias   '/usr/bin/git --git-dir=${HOME}/.dotfiles/ --work-tree=${HOME} "${@}"'
def dsa        'dot add'
def da         'dot add'
def dsau       'dot add -u .'
def dsua       'dot add -u .'
def dsc        'dot commit'
def dm         "dot commit -m '"
def dsco       'dot commit --only'
def dsd        'dot diff'
def dd         'dot diff'
def d          'dot diff'
def dsd.       'dot diff .'
def dd.        'dot diff .'
def d.         'dot diff .'
def dsde       'PAGER=delta dot diff'
def dsdc       'dot diff --staged'
def dsdce      'PAGER=delta dot diff --staged'
def dsg        'dot lg'
def dsl        'dot pull'
def dsp        'dot push'
def dsr        'dot restore'
def dsrc       'dot restore --staged'
def dsrs       'dot restore --staged'
def dotr       'dot rev-list --all --pretty=oneline -- '
def ds         'dot status'
def ds.        'dot status .'
def dsu        'dot status -u .'

# Git difftool command
def gdd          'git difftool'
def gmeld        'git difftool --tool=meld --'
def gmeld.cached 'git difftool --tool meld --cached --'
def dmeld        'dot difftool --tool=meld --'
def dmeld.cached 'dot difftool --tool meld --cached --'

# GitHub CLI
def gg 'gh copilot suggest'
def ge 'gh copilot explain'

# Grep
#def grepc      'command grep --color=always'
#def grepi      'grep -i'
#def grep.find  'grep -rHn'
#def grepi.find 'grep -i -rHn'

# head
def h-1 'head -n 1'
def h-2 'head -n 2'
def h-3 'head -n 3'
def h-4 'head -n 4'
def h-5 'head -n 5'

# LibreOffice
def sof 'libreoffice --headless --convert-to pdf *.ppt(|x)'
def sow 'libreoffice --headless --convert-to pdf *.doc(|x)'
def doc 'libreoffice --headless --convert-to pdf *.docx'

# ls
#def ls     'command ls ${LS_COLOR}'
#def l      'ls'
#def la     'ls -al'
#def las    'ls -al'
#def lc     'ls -1'
#def ll     'ls -lL'
#def lsa    'ls -a'
#def lsal   'ls -al'
#def lsla   'ls -al'
#def lsl    'ls -l'
#def ih     'command ls -al ${LS_COLOR_ALWAYS} | rg -i'
#def lsh    'ls -ld .[^.]*'
#def lsr    'ls -R'
#def since  'command ls -ltL ${LS_COLOR_ALWAYS} | head'
#def sincee 'command ls -ltL'
# Display only directories:
#def dod    'command ls -l ${LS_COLOR_ALWAYS} | rg ^d'
#def dod2   'command ls -1F ${LS_COLOR_ALWAYS} | rg /'
# Display only files:
#def dof    'command ls -l ${LS_COLOR_ALWAYS} | rg ^-'
#def dof2   'command ls -1F ${LS_COLOR_ALWAYS} | rg -v /'
# Display only hidden directories:
#def dohd   'ls -ld .[^.]*/'
#def dohd2  'ls -ad1 .[^.]*/'
# Display only hidden files:
#def doh    "ls -lAp | awk '{ if ($NF ~ /^\.[^/]*$/) print }'"
#def doh2   'ls -ap | rg "^\.[^/]*$"'

# mpv
def mpv.image   'mpv --no-config --pause --vo=tct'
def mpv.video   'mpv --no-config --vo=tct'
def mpv.youtube 'mpv -vo=caca'

# Neovim
def vib            '${EDITOR} -b'
def vim.bare       '${EDITOR} -u NONE'
def vim.plug.up    '${EDITOR} +PackerSync'
def vim.plug.clean '${EDITOR} +PackerClean'
def vim.plug.list  '${EDITOR} +PackerStatus'

# npm
#def run 'npm start'
#def run 'npm run dev'
def rux 'npx react-scripts start'

# Redshift
def red.norm 'redshift -P -O 6500'
def red.warm 'redshift -P -O 5000'

# Ripgrep
#
# NOTE:
#   Previously used:
#
#     alias rg='command rg --no-heading'
#
#   The `command` builtin was originally added defensively to force execution
#   of the real `rg` binary and avoid possible alias/function recursion.
#
#   However, aliases like:
#
#     alias rg='rg --no-heading'
#
#   do NOT recurse infinitely in zsh, because aliases are expanded only once
#   per parsing pass for the same token.
#
#   Additionally, keeping `command` here breaks workflows such as:
#
#     alias xargs='command xargs '
#     git ls-files | xargs grep text
#
#   since alias expansion after `xargs` may produce:
#
#     command rg --no-heading
#
#   which `xargs` cannot execute because `command` is a shell builtin rather
#   than a real executable.
#
#   P.S.
#     TODO: remove unnecessary `command` usage from other aliases as well.
#     It is generally only needed in shell functions, scripts, or in places
#     where bypassing aliases/functions is explicitly desired.
#def rg 'command rg --no-heading' # Basic rg search (color=auto, no headings)
def rg 'rg --no-heading' # Basic rg search (color=auto, no headings)
#   -n, or --line-number, meaning always show line numbers.
#   Line numbers are already enabled by default when stdout is a TTY, but
#   disabled by default in pipelines.
#   (!) Do not add this flag (-n) to the `rg` alias, it will break other
#   aliases/functions that rely on `rg`. When needed, add -n manually.
#
# The aliases below rely on Zsh recursively expanding the `rg` alias:
def grep           'rg'                # ^-- Kept for muscle memory
def grep.find      'grep'              # ^-- Kept for muscle memory
def grepc          'rg --color=always' # Force color always
def grepi          'rg -i'             # Case-insensitive search
def grepi.find     'grepi'             # ^-- Kept for muscle memory
def grep.find_all  'rg --hidden'       # Include hidden files
def grepi.find_all 'rg -i --hidden'    # Hidden + case-insensitive
def mgrep          'rg -U'             # Multiline search
def mgrepi         'rg -iU'            # Multiline + case-insensitive

def grepf           'rg -Hn'             # Force filename + line number always
def grepfi          'rg -i -Hn'          # Same, but case-insensitive
def grepf.find_all  'rg -Hn --hidden'    # Same, but include hidden files
def grepfi.find_all 'rg -i -Hn --hidden' # Same, but hidden + case-insensitive

# Scrot
def pic 'scrot -s ${HOME}/Screenshots/screenshot-%F-%H%M%S.png'

# SSH
def sa                  'ssh-add'
def sl                  'ssh-add -l'
def ssid                'eval "$(ssh-agent -s)"'
def get.fingerprint     'ssh-keygen -lf'
def get.fingerprint.md5 'ssh-keygen -E md5 -lf'

# Subversion
# --Preview
#def s            'svn status'
def s            'git status'
def si           'svn info'
def sd           'svndiff'
#def sdd          'svn diff'
def ssd          'svn diff --diff-cmd="meld"'
def svn.log      'svn log -r 1:HEAD'
def svn.log.head 'svn log -r HEAD:1 --limit 5'
def slg          'svn log -r HEAD:1 --limit 5'
def scat         'svn cat'
# --Actions
#def sa           'svn add'
def san          'svn add -N'
#def sr           'svn revert `--use-commit-times`'
def scc          'svn copy'
def sm           'svn move'
def ci           'svn commit'
def cim          'svn commit -m'
#def sc           'confirm "svn cleanup --remove-unversioned"'
#def key          'svn propset svn:keywords "Author Date Revision URL Id"'
#def ex           'svn propset svn:executable on'
def svn.checkout 'svn checkout `--use-commit-times`'
def svn.up       'svn update `--use-commit-times`'
def sup          'svn update `--use-commit-times`'
def svn.recommit 'svn commit -F svn-commit.tmp'
def svn.clean    'svn cleanup --remove-unversioned'

# tail
def t-1 'tail -n 1'
def t-2 'tail -n 2'
def t-3 'tail -n 3'
def t-4 'tail -n 4'
def t-5 'tail -n 5'

# Tmux
def tmux.ls    'tmux ls'
def tl         'tmux ls'
def tmux.which "tmux display-message -p '#S'"

# wdiff
# Find word differences in a unified diff stream and colorize them:
# Intended possible use: 'svn diff | wd'
def wd 'wdiff -d | colordiff'

# wmctrl
def win  'wmctrl -l'
def winx 'wmctrl -lx'
def wing 'wmctrl -l -G'

# xargs
def xav 'command xargs ${EDITOR}'
def xak 'command xargs kill -9'
def xar 'command xargs rm -v'

# yt-dlp
def ydn             'yt-dlp --no-playlist'
def yda             'yt-dlp --extract-audio'
# ^--- Extract audio from a whole playlist
def ydna            'yt-dlp --no-playlist --extract-audio'
def ydna3           'yt-dlp --no-playlist --extract-audio --audio-format mp3'
def ydl-clean-cache 'yt-dlp --rm-cache-dir'

#--------------------------------------
# Killing programs
#--------------------------------------

def kc    'killall cmus'
def stop  'killall mpg123'
def x.out 'killall xinit'

#------------------------------------------------------------------------------
# 20. Configs
#------------------------------------------------------------------------------

#---------------------------------------
# Switching configs
#---------------------------------------

def emacs.gnu  'ln -nsf ${XDG_CONFIG_HOME}/emacs-gnu ${XDG_CONFIG_HOME}/emacs'
def emacs.doom 'ln -nsf ${XDG_CONFIG_HOME}/emacs-doom ${XDG_CONFIG_HOME}/emacs'

#---------------------------------------
# Reloading configs
#---------------------------------------

def mkgrub       'sudo grub-mkconfig -o /boot/grub/grub.cfg'
def mkinit       'sudo mkinitcpio -p linux'
def xres.restart 'xrdb ${XDG_CONFIG_HOME}/X11/Xresources'
def retmux       'tmux kill-server; tmux source-file ~/.tmux.conf; tmux'
def reh          'rehash'
def a            'source ${ZDOTDIR}/.zshrc'

#---------------------------------------
# Editing configs
#---------------------------------------

def al      '${EDITOR} ${ZDOTDIR}/aliases.zsh'
def cm      '${EDITOR} ${XDG_CONFIG_HOME}/picom/picom.conf'
def cmd     '${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/config/commands.lua'
def dun     '${EDITOR} ${XDG_CONFIG_HOME}/dunst/dunstrc'
def ee      '${EDITOR} ${XDG_CONFIG_HOME}/emacs-gnu/init.el'
def eed     '${EDITOR} ${XDG_CONFIG_HOME}/doom/init.el'
def fn      '${EDITOR} ${ZDOTDIR}/functions.zsh'
def fn.fzf  '${EDITOR} ${ZDOTDIR}/fzf-functions.zsh'
def gconf   '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
def gitc    '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
def gitconf '${EDITOR} ${XDG_CONFIG_HOME}/git/config'
def hyp     '${EDITOR} ${XDG_CONFIG_HOME}/hypr/hyprland.conf'
def ic      '${EDITOR} ${XDG_CONFIG_HOME}/i3/config'
#def ic      '${EDITOR} ${XDG_CONFIG_HOME}/sway/config'
def icc     '${EDITOR} ${XDG_CONFIG_HOME}/i3blocks/config'
def irc     '${EDITOR} "${XDG_CONFIG_HOME}/ideavim/ideavimrc"'
def keys    '${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/config/keybindings.lua'
def lal     '${EDITOR} ${ZDOTDIR}/aliases.local.zsh'
def lfn     '${EDITOR} ${ZDOTDIR}/functions.local.zsh'
def lrc     '${EDITOR} ${XDG_CONFIG_HOME}/labwc/rc.xml'
def lsp     '${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/plugins/nvim-lspconfig.lua'
def lstart  '${EDITOR} ${XDG_CONFIG_HOME}/labwc/autostart'
def mime    '${EDITOR} ${XDG_CONFIG_HOME}/mimeapps.list'
def opts    '${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/config/options.lua'
def or      '${EDITOR} ${XDG_CONFIG_HOME}/obsidian/obsidian.vimrc'
def plug    '${EDITOR} ${XDG_CONFIG_HOME}/nvim/lua/plugins/init.lua'
def rc      '${EDITOR} ${XDG_CONFIG_HOME}/openbox/rc.xml'
def rr      '${EDITOR} ${XDG_CONFIG_HOME}/ranger/rc.conf'
def start   '${EDITOR} ${XDG_CONFIG_HOME}/openbox/autostart'
def swa     '${EDITOR} ${XDG_CONFIG_HOME}/sway/config'
def tg      '${EDITOR} ${XDG_CONFIG_HOME}/tig/config'
def tintrc  '${EDITOR} ${XDG_CONFIG_HOME}/tint2/tint2rc'
def tmuxr   '${EDITOR} ${XDG_CONFIG_HOME}/tmux/tmux.conf'
def xi      '${EDITOR} ${XDG_CONFIG_HOME}/X11/xinitrc'
def xres    '${EDITOR} ${XDG_CONFIG_HOME}/X11/Xresources'
def zenv    '${EDITOR} ${ZDOTDIR}/.zshenv'
def zo      '${EDITOR} ${ZDOTDIR}/.zprofile'
def zr      '${EDITOR} ${ZDOTDIR}/.zshrc'

#---------------------------------------
# Editing files
#---------------------------------------

def books '${EDITOR} -c "e ${PRO}/archived/2022/books/bibliography.bib | :cd %:p:h"'
def gi    '${EDITOR} ./.gitignore'
def gru   '${EDITOR} ${HOME}/.gmrun_history'
def his   '${EDITOR} ${ZDOTDIR}/histfile'
def ig    '${EDITOR} ./.gitignore'
def mak   '${EDITOR} ./Makefile'
def mk    '${EDITOR} ./Makefile'
def pasta '${EDITOR} "${DOTSHARE}/misc/pastes.tsv"'

#------------------------------------------------------------------------------
# 21. Window manager-specific
#------------------------------------------------------------------------------

#---------------------------------------
# i3
#---------------------------------------

def i3.out       'i3-msg exit'
def cmus.run     'kitty --class dropdown_aux tmux new-session cmus &'
def cmus.scratch \
  "i3-msg 'exec --no-startup-id kitty --class dropdown_aux tmux "\
"new-session cmus\;'"
# Avoid tmux session using an old I3SOCK environment variable after i3 restart
# Run this instead of `i3-msg` while in tmux
def i3-msg-tmux \
  'i3-msg --socket "${XDG_RUNTIME_DIR}/i3/$(command ls -t '\
'${XDG_RUNTIME_DIR}/i3/ | awk "{OFS=FS} {print $1}" | rg ipc | head -n 1)"'

#----------------------------------------
# Hyprland
# ---------------------------------------

def hout 'hyprctl dispatch exit'
def kh   'killall Hyprland'

#----------------------------------------
# Labwc
# ---------------------------------------

def kl    'killall labwc'
def lout  'labwc --exit'
def lreop 'labwc --reconfigure'

#---------------------------------------
# Openbox
#---------------------------------------

def autostart    '${XDG_CONFIG_HOME}/openbox/autostart'
def dout         'openbox --exit'
def theme.matrix '${BIN}/openbox-themes/matrix/enable'
def theme.riddle '${BIN}/openbox-themes/riddle/enable'
def f2of         'openbox-disable-F2-keybinding'
def f2on         'openbox-reenable-F2-keybinding'
def f11of        'openbox-disable-F11-keybinding'
def f11on        'openbox-reenable-F11-keybinding'
def reop         'openbox --reconfigure'

#----------------------------------------
# Sway
# ---------------------------------------

def kx 'killall swaybar'
# Run this instead of `swaymsg` while in tmux
#def swaymsg-tmux 'swaymsg --socket "$(find /run/user/$(id -u)/sway-ipc.*
#  -type s 2>/dev/null | sort -t. -k2 -n | tail -n1)"'
def swaymsg-tmux \
  'swaymsg --socket "$(fd -g "sway-ipc.*" /run/user/"$(id -u)" '\
'2>/dev/null | sort -t. -k2 -n | tail -n1)"'
def sout 'swaymsg-tmux exit'

#------------------------------------------------------------------------------
# 22. Aliases to Zsh functions
#------------------------------------------------------------------------------

def bb     'bc'  # Not a calculator
def clone  'git_clone_ssh'
def clones 'git_clone_ssh'
def cols   'colv tab'
def f      'fieldc tab'
def fe     'edit-file'
def fea    'edit-file --hidden'
def ff     'find.file'
def he     'help'
def hs     'https_to_ssh'
def llc    'clipcmd'
def lo     'lowercase *'
def mah    'help'
def manh   'help'
def mf     'manf'
def mh     'help'
#def sa     'snake-case'
def spa    'spaces-to-underscores *'
def tc     'tmux-clean'
def u      'uv-run'
def ver    'version'
def wa     'waste'

#------------------------------------------------------------------------------
# 23. Aliases to scripts
#------------------------------------------------------------------------------

def setx   'set-keyboard-layout'
def thanks '(${BIN}/sounds/thanks-hal &) > /dev/null'
def dark   'set-dark-gtk-theme'
def light  'set-light-gtk-theme'
def pst    'c ${PRO}/archived/2022/npBuild && ./packageStats'

#------------------------------------------------------------------------------
# 24. Aliases as flags
#------------------------------------------------------------------------------

# Usage: command `--use-commit-times`
def --use-commit-times 'echo --config-option=config:miscellany:use-commit-times=yes'
def -uname             'uname -sm | sed -e "s/-.* / /" -e "s/ /-/g"'
def --uname            'uname -srm | sed -e "s/-.* / /" -e "s/ /-/g"'
def --datetime         'date +%F_%H_%M_%S'
def --retrieved-time   'date '\''+%F %H:%M'\'''
def --datecomment      'date "+#DATE: %F %T %Z"'

def -time              'date +%H:%M:%S'
def --time             'date +%H:%M:%S'
def -date              'date +%Y.%m.%d'
def --date             'date +%Y-%m-%d'
def -today             'date +%Y.%m.%d'
def --today            'date +%Y-%m-%d'
def -tomorrow          'date -d now+1day +%Y.%m.%d'
def --tomorrow         'date -d now+1day +%Y-%m-%d'
def -after-tomorrow    'date -d now+2days +%Y.%m.%d'
def --after-tomorrow   'date -d now+2days +%Y-%m-%d'
def -yesterday         'date -d now-1day +%Y.%m.%d'
def --yesterday        'date -d now-1day +%Y-%m-%d'
def -before-yesterday  'date -d now-2days +%Y.%m.%d'
def --before-yesterday 'date -d now-2days +%Y-%m-%d'
def -a-week-ago        'date -d now-7days +%Y.%m.%d'
def --a-week-ago       'date -d now-7days +%Y-%m-%d'
def -in-a-week         'date -d now+7days +%Y.%m.%d'
def --in-a-week        'date -d now+7days +%Y-%m-%d'

#------------------------------------------------------------------------------
# 25. Programming
#------------------------------------------------------------------------------

#---------------------------------------
# Languages
#---------------------------------------

# C
def gdb.super 'gdb --batch --ex run --ex bt --ex q --args'
def vl        'valgrind'
def vll       'vlt --leak-check=full --show-leak-kinds=all'
def vllv      'vlt --leak-check=full --show-leak-kinds=all -v'
def vlt       'valgrind --track-origins=yes --leak-check=full'
def vt        'valgrind --track-origins=yes'

# Python
def p         'python'
def pi        'ipython --TerminalInteractiveShell.editing_mode=vi'
def py.exe    'python -c'
def qenv      'deactivate'
def ve        'source .venv/bin/activate'
def venv.init 'python3 -m venv .venv'
def venv      'source .venv/bin/activate'

# R
def R 'R --no-save --no-restore'

# SQL
def sf 'sqlfluff format'
#def sl 'sqlfluff lint'

#---------------------------------------
# Frameworks
#---------------------------------------

# Django
def pmp  'python manage.py'
def runs 'python manage.py runserver'
def mig  'pmp makemigrations && pmp migrate'

#---------------------------------------
# Tools
#---------------------------------------

# Jupyter
def jup-to-md 'jupyter nbconvert --to markdown'

# VS Code
def drop-service-worker 'rm -rf -v "${XDG_CONFIG_HOME}/Code/Service Worker"'

#---------------------------------------
# Databases
#---------------------------------------

def mg  'mysql -u root -p'
def mug 'mysql -u user -p'
def mag 'sudo mariadb -u root -p'
def pg  'sudo -iu postgres psql postgres'

#------------------------------------------------------------------------------
# 26. Misc
#------------------------------------------------------------------------------

# Count files in the directory:
def cf        'setopt CSH_NULL_GLOB; files=(*); echo ${#files[@]};'
# Count only hidden files in the directory:
def cfa       'setopt CSH_NULL_GLOB; files=(.*); echo ${#files[@]};'
# Count directories:
def cfd       'setopt CSH_NULL_GLOB; dirs=(*/); echo ${#dirs[@]};'
def empty     'truncate -s 0'
def fld       'fold -w 80 -s'
def immutable 'sudo chattr +i'
def mutable   'sudo chattr -i'
def prun      'perldoc perlrun'  # Similar text can be shown with `man perlrun`
def rl        'readlink -f'
def rows      'tr "\\n" " "'  # Used in a pipe, ... | rows
def tag       'ctags -R .'
def ton '[[ ${HOST} == panther* ]] && xinput enable "SYNA8005:00 06CB:CD8C Touchpad"'
def tof '[[ ${HOST} == panther* ]] && xinput disable "SYNA8005:00 06CB:CD8C Touchpad"'
def wl        'wc -l'
def xres.show 'xrdb -query -all'

# "del": uncomment only the "pager = delta" line
def del \
  "sed -i '/^\[core\]/,/^\[/{s/^\([[:space:]]*\)#\s*"\
"\(pager[[:space:]]*=[[:space:]]*delta\)/\1\2/}' ${XDG_CONFIG_HOME}/git/config"
# "nodel": comment out only the "pager = delta" line
def nodel \
  "sed -i '/^\[core\]/,/^\[/{s/^\([[:space:]]*\)\(pager[[:space:]]*="\
"[[:space:]]*delta\)/\1#\2/}' ${XDG_CONFIG_HOME}/git/config"

#------------------------------------------------------------------------------
# 27. Temporary aliases (maybe they will stick)
#------------------------------------------------------------------------------
