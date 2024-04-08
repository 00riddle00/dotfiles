#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-04-06 22:17:38 EEST
# Path:   ~/.config/zsh/aliases.zsh
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
#*
#  NOTE: many of these aliases are not being used anymore or are being used
#  very rarely, however, I still keep them there as a sort of command-wiki,
#  since quite a few times it turned out to be pretty useful to look up some
#  stuff that I aliased a while ago.
#
#  In the future, since the number of aliases is getting big, in order to avoid
#  unexpected outcomes in the command line, it would be reasonable not to
#  source them in .zshrc, but to put in a separate text file.
#**
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
#  22. Aliases to scripts
#  23. Aliases as flags
#  24. Programming
#  25. Screen setup
#  26. Misc
#  27. Temporary

#------------------------------------------------------------------------------
# 1. Navigation
#------------------------------------------------------------------------------

# Going up
alias ..='c ..'
alias ...='c ../..'
alias ....='c ../../..'
alias .....='c ../../../..'
alias ./='c ..'

## Temporary directories
alias mp='cd $HOME/tmp1'
alias mp1='cd $HOME/tmp1'
alias mp2='cd $HOME/tmp2'
alias mp3='cd $HOME/tmp3'
alias mp4='cd $HOME/tmp4'
alias mp5='cd $HOME/tmp5'
alias mp6='cd $HOME/tmp6'
alias mp7='cd $HOME/tmp7'
alias mp8='cd $HOME/tmp8'
alias mp0='cd $HOME/tmp8'

## Various locations
alias bak='cd $HOME/backups'
alias bin='cd $HOME/.local/bin'
alias candy='cd $CANDY'
alias conf='cd $XDG_CONFIG_HOME'
#alias data='cd $XDG_DATA_HOME'
alias drop='cd $DROPBOX'
alias drop.bak='cd $DROPBOX/backup'
alias dw='cd $HOME/Downloads'
alias lok='cd $HOME/.local'
alias notes='cd $NOTES'
alias pro='cd $HOME/pro'
alias share='cd $DOTSHARE'
alias sk='cd $HOME/Screenshots'
alias zdot='cd $ZDOTDIR'
alias res='cd $XDG_DATA_HOME/tmux/resurrect'
alias op='cd $XDG_CONFIG_HOME/openbox'
alias hist='cd $HOME/histfiles/'

#------------------------------------------------------------------------------
# 2. Getting information
#------------------------------------------------------------------------------

# Hostname and path
alias path='echo $PATH | tr ":" "\n"'
alias host='echo $HOST' 

# Disk info
alias fl='sudo fdisk -l'
alias lf='lsblk -f'

# Video info
alias info.video='lspci | grep -e VGA -e 3D'
alias gpu.which='glxinfo | grep -E "OpenGL vendor|OpenGL renderer"'
alias gpu.load='watch -n 1 nvidia-smi'

# Window info
alias get.win_class='xprop | grep -i class'
alias get.win_pos_size='xwininfo'
alias getpos='xwininfo -id $(xdotool getactivewindow)'

# Keyboard keys info
alias get.keyname='xev'
## ^--press keys and Enter (`cat` also can be used)
alias get.key_code_1='sed -n l'
alias get.key_code_2='showkey --ascii'

#------------------------------------------------------------------------------
# 3. Standard commands
#------------------------------------------------------------------------------

alias x='clear'
alias cpr='cp -r'
alias off='sudo poweroff'
alias prego='sudo $(fc -ln -1)'
alias q='exit'
alias re='sudo reboot'
alias rmr='rm -rf'  
alias rmrf='sudo rm -r'  

#------------------------------------------------------------------------------
# 4. Modifying shell behavior
#------------------------------------------------------------------------------

alias show_hidden='setopt -s glob_dots'

#------------------------------------------------------------------------------
# 5. Permissions
#------------------------------------------------------------------------------

alias ch='sudo chown -R $USER:$USER'
alias let='chmod 755'
alias letr='chmod -R 755'
alias exe='chmod +x'

#------------------------------------------------------------------------------
# 6. Clipboard
#------------------------------------------------------------------------------

alias xclip='xclip -selection clipboard'
alias xclip.prim='xclip -selection primary'
alias xclip.sec='xclip -selection secondary'
alias copy='xclip'

#------------------------------------------------------------------------------
# 7. Fonts
#------------------------------------------------------------------------------
alias fonts.update='fc-cache -fv'
alias fonts.current='fc-match --verbose Sans'
alias fonts.find='fc-list | grep -i'
alias fonts.match='fc-match'

#------------------------------------------------------------------------------
# 8. Keyboard layouts
#------------------------------------------------------------------------------
#
alias lt='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt'
# ^--choosing 'lt' also resets languages to the usual  'us,lt' combination
alias de='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,de'
alias es='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,es'
alias he='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il'
alias ru="setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle -layout 'us,lt,ru' -variant ',,phonetic'"
alias emacs.nocaps='setxkbmap -option ctrl:nocaps'
alias emacs.caps='setxkbmap -option && fix-xkbmap'
alias nocaps='sudo dumpkeys | sed "s/\s*58\s*=\s*Caps_Lock/ 58 = Control/" | sudo loadkeys'

#------------------------------------------------------------------------------
# 9. Screen brightness
#------------------------------------------------------------------------------

alias xminus='light -U 10'
alias xplus='light -A 10'

#------------------------------------------------------------------------------
# 10. Sound
#------------------------------------------------------------------------------

alias aminus='amixer set Master 10%-'
alias aplus='amixer set Master 10%+'
alias mute='amixer -q sset Master toggle'

#------------------------------------------------------------------------------
# 11. Clock and time
#------------------------------------------------------------------------------

alias clock.sync='sudo ntpd -qg'
alias timezone.update='timedatectl set-timezone "$(curl --fail https://ipapi.co/timezone)"'

#------------------------------------------------------------------------------
# 12. Systemd
#------------------------------------------------------------------------------

# General
alias systemd.running='systemctl --type=service'
alias systemd.list='systemctl list-unit-files'
alias systemd.enabled='systemctl list-unit-files | grep enabled'
alias systemd.boot='systemd-analyze blame'
alias systemd.boot_total='systemd-analyze time'

# Databases
alias mysql.start='sudo systemctl start mysqld'
alias post='systemctl start postgresql'

# Servers
alias apache='systemctl start httpd.service'
alias reapache='systemctl restart httpd'

# Wired
alias net="systemctl start dhcpcd@$(basename -a /sys/class/net/enp*).service"
alias renet="systemctl restart dhcpcd@$(basename -a /sys/class/net/wlp*).service"

# Wireless
alias wnet="sudo systemctl start dhcpcd@$(basename -a /sys/class/net/wlp*).service"
alias rewnet="sudo systemctl start dhcpcd@$(basename -a /sys/class/net/wlp*).service"
alias wifi.off="sudo ip link set $(basename -a /sys/class/net/wlp*) down"
alias wifi.on="sudo ip link set $(basename -a /sys/class/net/wlp*) up"

#------------------------------------------------------------------------------
# 13. Network
#------------------------------------------------------------------------------

alias pp='ping -c 3 www.google.com'
alias ppp='watch -n 0.5 "ping -c 3 www.google.com"'
alias get.my_ip='curl -w "\n" ifconfig.me'
alias get.local_ip='ip route | head -n 1'
alias get.gateway='ip route | head -n 1'
alias get.net_interface='ip route | head -n 1' # get the current active interface name
alias check.ip='whois'
alias check.dns='nslookup'
alias check.domain='whois'

#------------------------------------------------------------------------------
# 14. WPA Supplicant
#------------------------------------------------------------------------------

alias wpa.caffeine="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/caffeine.conf"
alias wpa.caif="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/caif-cafe.conf"
alias wpa.comet="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/comet.conf"
alias wpa.eduroam="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/eduroam.conf"
alias wpa.home="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/home.conf"
alias wpa.huracan="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/huracan.conf"
alias wpa.mif="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/mif-open.conf"
alias wpa.rde="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/rde.conf"
alias wpa.sodas="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/sodas.conf"
alias wpa.vu="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/vu-wifi.conf"
alias wpa.wpa="sudo wpa_supplicant -B -i $(basename -a /sys/class/net/wlp*) -c /etc/wpa_supplicant/wpa_supplicant.conf"

#------------------------------------------------------------------------------
# 15. Mount/Unmount
#------------------------------------------------------------------------------

alias phone.on='simple-mtpfs $HOME/phone' # if problems, remount + restart thunar
alias phone.off='umount $HOME/phone'

#------------------------------------------------------------------------------
# 16. Process Management
#------------------------------------------------------------------------------

alias kil='sudo kill -9'

### `ps -e` displays every active process on a Linux system in Unix format
alias ae='ps -e | grep -v grep | grep -i'
###     use `ps c -ef` for a simple name of executable (as well as showing process status)

### '-f' performs a full-format listing
alias aef='ps -ef | grep -m1 ""  && ps -ef | grep -v grep | grep -i'

### another way of listing (shows session id)
alias aes="ps -e -o 'user,pid,pgid,sess,args' | grep -m1 \"\" && ps -e -o 'user,pid,pgid,sess,args' | grep -v grep | grep -i"

### Display all processes in BSD format 
###     'a' option displays the processes belonging to every user
###     'x' option tells ps to show all the processes regardless of 
###         what terminal (if any) they are controlled ('?" in TTY column indicated
###         no controlling terminal)
alias au='ps ax | grep -v grep | grep -i'    
###     use `ps cax` for a simple name of executable (as well as showing process status)

###     'u' option is for user-oriented format
alias aux='ps aux | grep -v grep | grep -i'  

### also show parent pid
alias aup='ps ax l | grep -v grep | grep -i'

## show sleeping processes
alias asleep='ps ax | grep -v grep | grep sleep'

# fuser -v {file/socket name(s)} - show info about process, working with the file(s)/socket(s)
alias fuserv='fuser -v'

# fuser -vk {file/socket name(s)} - kill the process working with the file(s)/socket(s)
# ex. usage: fuser -vk *.log
alias fuserk='fuser -vk'

#------------------------------------------------------------------------------
# 17. Package management
#------------------------------------------------------------------------------

#---------------------------------------
# npm
#---------------------------------------

alias npm.ls='npm list --depth=0'
alias npm.ls.g='npm list -g --depth=0'

#---------------------------------------
# Pacman
#---------------------------------------

#------------------
# -Q flag
#------------------

alias orphans='pacman -Qdtq'
alias is='pacman -Qeq | grepi '     # grep for explicitly installed package (package 'is' in the system)
alias isa='pacman -Qq | grepi '     # grep for installed package ('isa' = 'is -a' as in 'ls -a', with 'implicitly installed packages' as 'hidden files')
alias visa='pacman -Q | grepi '     # grep for installed package with version info ('visa' = 'is -a -v')
alias pl='pacman -Qeq'              # list explicitly installed packages
alias ple='pacman -Qeq'             # ------||------
alias ple_no_aur='a_minus_b <(ple) <(plm)' # list explicitly installed packages (without showing AUR packages)
alias pla='pacman -Qq'              # list all installed packages
alias pld='pacman -Qdq'             # list packages dependencies
alias plm='pacman -Qmq | sort'      # list foreign packages (mainly from AUR) (pacman lists packages in a different way than "sort" command!)
alias pac.owner='pacman -Qo'        # which package owns the specified file(s)
alias pac.group='pacman -Qgq'       # list installed packages belonging to a group (or list all groups and packages if no argument is passed)
alias pac.group.belongs='pacman -Qgq | grepi' # show which group the installed package belongs to
alias pac.base='a_and_b <(pac.base_remote) <(pla)' # list installed packages depending on `base` metapackage
alias pac.base-devel='a_and_b <(pac.base-devel_remote) <(pla)' # list installed packages depending on `base-devel` metapackage
alias pac.info='pacman -Qi'         # display info on a given installed package
alias pac.search='pacman -Qs'       # search each installed package for names or descriptions that match regexp
alias pac.check_files='pacman -Qk'  # for all installed pkgs, check that all files owned by the given package(s) are present on the system.
alias pac.check_files_detailed='pacman -Qkk' # more detailed checking (+ permissions, file sizes, and modification times) for pkgs that contain the needed mtree file.

#------------------
# -S flag
#------------------

alias pacfile='sudo pacman -S --noconfirm - --needed <'       # install from file
alias pacs='sudo pacman -S --noconfirm --needed'              # `needed` does not reinstall targets that are up to date
alias pac.group_remote='sudo pacman -Sgq'                     # list packages from sync database belonging to a group
alias pac.base_remote='expac -S '%E' base | xargs -n1 | sort' # list packages from sync database depending on `base` metapackage
alias pac.base-devel_remote='expac -S '%E' base-devel | xargs -n1 | sort' # list packages from sync database depending on `base-devel` metapackage
alias pac.info_remote='sudo pacman -Si'                       # display info on a given sync database package
alias pac.info_remote_full='sudo pacman -Sii'                 # ^--- and also display those packages in all repos that depend on this package.
alias pac.search_remote='sudo pacman -Ss'                     # search each package from sync database for names or descriptions that match regexp
# removes uninstalled packages from /var/cache/pacman/pkg and cleans unused
# repos in /var/lib/pacman
alias pac.clear='sudo pacman -Sc'
# removes ALL packages from /var/cache/pacman/pkg and ...
alias pac.clear_all='sudo pacman -Scc'
# fuzzy-search through all available packages, with package info shown in a preview window, and then install selected packages
alias fzf.pac='pacman -Slq | fzf -m --preview 'pacman -Si {1}' | xargs -ro sudo pacman -S'
# -------------------------------------------------------------------------
# updates your pkg databases if the repositories haven’t been checked 
# recently, and upgrades any new package versions.
# -y -> update
# -u -> upgrade
alias up='sudo pacman -Syu'
# forces updates of your databases for all repositories (even if it 
# was just updated recently) and upgrades any new package versions.
alias up1='sudo pacman -Syyu'
#  upgrades packages and also downgrades packages (if you happen to have a
#  newer version than in the repository). Normally this should not be used.
#  Only if you’re trying to fix a specific issue due to a new package being
#  removed from the repository.
alias up2='sudo pacman -Syuu'
# -------------------------------------------------------------------------

#------------------
# -R flag
#------------------

alias pacr='sudo pacman -Rns'
alias freeorphans='sudo pacman -Rns $(pacman -Qdtq)'
# Avoid using the -d option with pacman. pacman -Rdd package skips dependency checks during package removal. 
# As a result, a package providing a critical dependency could be removed, resulting in a broken system.
alias pac.forcedel='sudo -k pacman -Rdd'

#---------------------------------------
# Paru
#---------------------------------------

alias parus='paru -S'
alias paru.info='paru -Si'
alias parug='paru -G'
### fuzzy-search through the AUR, preview info and install selected packages
alias fzf.paru='paru -Slq | fzf -m --preview "paru -Si {1}" | xargs -ro paru -S --noconfirm'

#---------------------------------------
# PIP
#---------------------------------------

alias pipu='pip install --upgrade pip'

#------------------------------------------------------------------------------
# 18. ABS (Arch Build System)
#------------------------------------------------------------------------------

alias mps='makepkg -s'      # --syncdeps
alias mpi='makepkg -si'     # --install
alias mpic='makepkg -sic'   # --clean
alias pacu='sudo pacman -U' # argument: pkgname-pkgver.pkg.tar.zst

#------------------------------------------------------------------------------
# 19. Programs
#------------------------------------------------------------------------------

#--------------------------------------
# Launching programs
#--------------------------------------

alias bs='basename'
alias cat='bat'
alias dosbox='dosbox -conf "$XDG_CONFIG_HOME/dosbox/dosbox-0.74-3.conf"'
alias emacs.cmd='emacs -nw' # --no-window-system'
alias enc='uchardet'
alias espeak='espeak -ven-uk'
alias fire='firefox'
alias irssi='irssi --config="$XDG_CONFIG_HOME/irssi/config" --home="$XDG_DATA_HOME/irssi"'
alias libre='libreoffice'
alias ls='colorls'
#alias ls='ls --color=auto'
alias lynx='lynx -lss="$XDG_CONFIG_HOME/lynx/lynx.lss"'
alias mc='mc --nosubshell'
alias mi='nomacs'
alias nn='neofetch'
alias rss='newsboat'
#alias svn='svn --config-dir "$XDG_CONFIG_HOME/subversion"'
#alias t='thunar'
alias tar='tar -xvf'
alias timer='termdown -B | lolcat'
alias tl='translit'
alias unrar='unrar x'
alias v='$EDITOR'
alias vmi='$EDITOR'
alias vv='sudo $EDITOR'
alias yd='yt-dlp'
## A trailing space in `watch ` causes the next word to be checked for 
## alias substitution when the alias is expanded.
##
## Usage:
## watch ple                     # OK:  alias `ple` is expanded as `pacman -Qeq`
## watch ple | grep ^z           # BAD: multiple commands, need to quote everything
## watch "ple | grep ^z"         # BAD: when quoted, aliases do not expand in this case
## watch "pacman -Qeq | grep ^z" # OK:  no aliases inside quotes
##
## `watch -n 0` is equivalent to `watch -n 0.1`
alias watch='watch '

#--------------------------------------
# Using programs
#--------------------------------------

# Colorls
alias la='colorls -al'
alias lc='colorls -1'
alias lsa='colorls -a'
alias lsal='colorls -al'
alias lsla='colorls -al'
alias lsl='colorls -l'
alias ih='colorls -la | grep -i'
alias lsh='colorls -ld .?*'
alias since='colorls -lt'
# display only directories:
alias dod='colorls -ld'
# display only files:
alias dof='colorls -lf'

# Cowfortune
alias cff='fortune | cowsay'
alias cfr='fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'

# Crontab
alias ce='crontab -e'
alias cl='crontab -l'

# du
alias dusort.all='du -h --max-depth=1 | sort -h' # including hidden files
alias dusort='du -chs * | sort -h'
alias du.total=' du -s --si'
alias trackmem.hidden='watch -n 5 "du -h --max-depth=1 | sort -h"'
alias trackmem='watch -n 5 "du -hs * | sort -h"'

# feh
alias wall='feh --bg-scale'

# find
alias ff='find . -name'
# find different file extensions, exluding ./.git, ./venv and ./.idea dirs.
alias files.ext="find . -path ./.git -o -path ./venv -prune -o -path ./.idea -prune -o -type f | sed -rn 's|.*/[^/]+\.([^/.]+)$|\1|p' | sort -u"

# mpv
alias mpv.image='mpv --no-config --pause --vo=tct'
alias mpv.video='mpv --no-config --vo=tct'
alias mpv.youtube='mpv -vo=caca'

# Redshift
alias red.norm='redshift -P -O 6500'
alias red.warm='redshift -P -O 5000'

# Git
alias ga='git add'
alias gb='git branch'
alias gc='git commit'
alias gch='git checkout'
alias gl='git pull'
alias gd='git diff'
alias gdc='git diff --cached'
alias glg='git lg'
alias gp='git push'
alias gs='git status'
alias gr='git restore'
alias grs='git restore --staged'
alias clone='git clone'
# By default, `git fetch` does not remove remote branches that 
# no longer have a counterpart branch on the remote. In order 
# to do that, you explicitly need to prune the list of remote branches:
# `git fetch --prune`. This will automatically get rid of remote branches 
# that no longer exist on the remote. Afterwards, `git branch --remote` 
# will show you an updated list of branches that really exist on the 
# remote: And those you can delete using git push.
alias gfp='git fetch --prune'

# GitHub CLI
alias gg='gh copilot suggest'
alias ge='gh copilot explain'

# Grep
alias grep='grep --color=auto'
alias grepi='grep -i'
alias grep.find='grep -rHn'
alias grepi.find='grep -i -rHn'
alias grepp='grep -P'

# Silver Searcher
alias agi='ag -i'
alias ag.find='ag -rs --noheading'
alias agi.find='ag -rsi --noheading'
alias ag.find_all='ag -rs --noheading --hidden'
alias agi.find_all='ag -rsi --noheading --hidden'

# ls
#alias l='ls'
#alias la='ls -al'
#alias las='ls -al'
#alias lc='ls | cat'
#alias ll='ls -lL'
#alias lla='ls -lad .*'
#alias lsa='ls -a'
#alias lsal='ls -al'
#alias lsh='ls -ld .?*'
#alias lsl='ls -l'
#alias lsla='ls -al'
#alias lsr='ls -R'
#alias since='\ls -ltL | head'
# display only directories:
#alias dod='\ls -l | grep ^d'
# display only files:
#alias dof='\ls -l | grep ^-'

# Scrot
alias pic='scrot -s $HOME/Screenshots/screenshot-%F-%H%M%S.png'

# SSH
#alias sa='ssh-add'
alias sl='ssh-add -l'
alias ssid='eval $(ssh-agent -s)'


# Subversion
# --Preview
alias s='svn status'
alias ss='echo "Change your habits!"'
alias sd='svndiff'
alias sdd='svn diff'
alias ssd='svn diff --diff-cmd="meld"'
alias svn.log='svn log -r 1:HEAD'
alias svn.log.head='svn log -r HEAD:1 --limit 5'
alias slh='svn log -r HEAD:1 --limit 5'
# --Actions
alias sa='svn add'
alias sr='svn revert `--use-commit-times`'
alias sm='svn move'
alias sci='svn commit'
alias sc='svn cleanup --remove-unversioned'
alias key='svn propset svn:keywords "Author Date Revision URL Id"'
alias ex='svn propset svn:executable on'
alias svn.checkout='svn checkout `--use-commit-times`'
alias svn.up='svn update `--use-commit-times`'
alias sup='svn update `--use-commit-times`'
alias svn.recommit='svn commit -F svn-commit.tmp'
alias svn.clean='svn cleanup --remove-unversioned'

# Vim/Neovim
alias vim='$EDITOR'
alias vib='$EDITOR -b'
alias vim.bare='$EDITOR -u NONE'
alias vim.plug.install='$EDITOR +PlugInstall +qall'
alias vim.plug.up='$EDITOR +PlugUpdate +qall'
alias vim.plug.clean='$EDITOR +PlugClean +qall'
alias vim.plug.list='$EDITOR +PlugStatus'

# yt-dlp
alias ydn='yt-dlp --no-playlist' 
alias ydna='yt-dlp --no-playlist --extract-audio'
alias ydna3='yt-dlp --no-playlist --extract-audio --audio-format mp3'
alias ydl-clean-cache='yt-dlp --rm-cache-dir'

#--------------------------------------
# Quitting programs
#--------------------------------------

#alias out='killall xinit'
alias stop='killall mpg123'

#------------------------------------------------------------------------------
# 20. Configs
#------------------------------------------------------------------------------

#---------------------------------------
# Switching configs
#---------------------------------------

alias emacs.gnu='ln -nsf $XDG_CONFIG_HOME/emacs-gnu $XDG_CONFIG_HOME/emacs'
alias emacs.doom='ln -nsf $XDG_CONFIG_HOME/emacs-doom $XDG_CONFIG_HOME/emacs'

#---------------------------------------
# Reloading configs
#---------------------------------------

alias mkgrub='sudo grub-mkconfig -o /boot/grub/grub.cfg'
alias mkinit='sudo mkinitcpio -p linux'
alias xres.restart='xrdb $XDG_CONFIG_HOME/X11/Xresources'
alias retmux='tmux kill-server; tmux source-file ~/.tmux.conf; tmux'
alias z='source $ZDOTDIR/.zshrc'

#---------------------------------------
# Editing configs
#---------------------------------------

alias al='$EDITOR $ZDOTDIR/aliases.zsh'
alias cm='$EDITOR $XDG_CONFIG_HOME/picom/picom.conf'
alias dun='$EDITOR $XDG_CONFIG_HOME/dunst/dunstrc'
alias ee='$EDITOR $XDG_CONFIG_HOME/emacs-gnu/init.el'
alias eed='$EDITOR $XDG_CONFIG_HOME/doom/init.el'
alias fn.fzf='$EDITOR $ZDOTDIR/functions_fzf.zsh'
alias fn='$EDITOR $ZDOTDIR/functions.zsh'
alias ic='$EDITOR $XDG_CONFIG_HOME/i3/config'
alias icc='$EDITOR $XDG_CONFIG_HOME/i3blocks/config'
alias gitconf='$EDITOR $XDG_CONFIG_HOME/git/config'
alias lal='$EDITOR $ZDOTDIR/aliases.local.zsh'
alias lfn='$EDITOR $ZDOTDIR/functions.local.zsh'
alias mime='$EDITOR $XDG_CONFIG_HOME/mimeapps.list'
alias rc='$EDITOR $XDG_CONFIG_HOME/openbox/rc.xml'
alias rr='$EDITOR $XDG_CONFIG_HOME/ranger/rc.conf'
alias start='$EDITOR $XDG_CONFIG_HOME/openbox/autostart.sh'
alias tg='$EDITOR $XDG_CONFIG_HOME/tig/config'
alias tintrc='$EDITOR $XDG_CONFIG_HOME/tint2/tint2rc'
alias tmuxr='$EDITOR $XDG_CONFIG_HOME/tmux/tmux.conf'
alias vr='$EDITOR $VIMRC'
alias xi='$EDITOR $XDG_CONFIG_HOME/X11/xinitrc'
alias xres='$EDITOR $XDG_CONFIG_HOME/X11/Xresources'
alias zenv='$EDITOR $HOME/.zshenv'
alias zr='$EDITOR $ZDOTDIR/.zshrc'

#------------------------------------------------------------------------------
# 21. Window manager-specific
#------------------------------------------------------------------------------

#---------------------------------------
# i3
#---------------------------------------

alias i3.out='i3-msg exit'
alias i3.notes='i3-msg exec "urxvt -name notes -hold -e zsh -c $BIN/vimnotes.sh"'
alias cmus.run='urxvt -name dropdown_aux -e tmux new-session cmus &'
alias cmus.scratch="i3-msg 'exec --no-startup-id urxvt -name dropdown_aux -e tmux new-session cmus\;'"
## avoid tmux session using an old I3SOCK environment variable after i3 restart
## run this instead of `i3-msg` while in tmux
alias i3-msg-tmux='i3-msg --socket "/run/user/1000/i3/$(\ls -t /run/user/1000/i3/ | awk "{print $1}" | grep ipc | head -n 1)"'

#---------------------------------------
# Openbox
#---------------------------------------

alias autostart='$XDG_CONFIG_HOME/openbox/autostart.sh'
alias theme.matrix='$BIN/themes/matrix/run'
alias theme.riddle='$BIN/themes/riddle/run'
alias f2on='openbox-enable-F2-keybinding'
alias f2of='openbox-disable-F2-keybinding'
alias reop='openbox --reconfigure'

#------------------------------------------------------------------------------
# 22. Aliases to scripts
#------------------------------------------------------------------------------

alias setx='fix-xkbmap'
alias 12on='gtk3-enable-12px-font'
alias 12of='gtk3-disable-12px-font'
alias thanks='($BIN/sounds/thanks-hal &) > /dev/null'

#------------------------------------------------------------------------------
# 23. Aliases as flags
#------------------------------------------------------------------------------

# usage: command `--use-commit-times`
alias -- --use-commit-times='echo --config-option=config:miscellany:use-commit-times=yes'
alias -- --date='date "+%F"'
alias -- --datetime='date +%F_%H_%M_%S'
alias -- -time='date +%H:%M:%S'
alias -- --st'--staged'

#------------------------------------------------------------------------------
# 24. Programming
#------------------------------------------------------------------------------

#---------------------------------------
# Languages
#---------------------------------------

# Python
alias p='python'
alias pi='ipython --TerminalInteractiveShell.editing_mode=vi'
alias py.exe='python -c'
alias qenv='deactivate'
alias venv.init='python3 -m venv venv'
alias venv='source venv/bin/activate'
alias tre='tree -I "venv|__pycache__"'

# C
alias gdb.super='gdb --batch --ex run --ex bt --ex q --args'
alias vl='valgrind'
alias vll='vlt --leak-check=full --show-leak-kinds=all'
alias vllv='vlt --leak-check=full --show-leak-kinds=all -v'
alias vlt='valgrind --track-origins=yes --leak-check=full'
alias vt='valgrind --track-origins=yes'

#---------------------------------------
# Frameworks
#---------------------------------------

# Django
alias pmp='python manage.py'
alias runs='python manage.py runserver'
alias mig='pmp makemigrations && pmp migrate'

#---------------------------------------
# Databases
#---------------------------------------

alias mysqlr='mysql -u root -p'
alias mysqlri='mysql -u user -p'
alias pg='sudo -iu postgres psql postgres'

#------------------------------------------------------------------------------
# 25. Screen setup
#------------------------------------------------------------------------------

#---------------------------------------
# Laptop only
#---------------------------------------

alias x.laptop.auto='xrandr --output $LAPTOP_SCREEN --auto'
alias x.laptop.normal='xrandr --output $LAPTOP_SCREEN --rotate normal'
alias x.laptop.port='xrandr --output $LAPTOP_SCREEN --rotate left'
alias x.laptop.of='xrandr --output $LAPTOP_SCREEN --off'

#---------------------------------------
# 1 Monitor only
#---------------------------------------

# HDMI connection
alias x.hdmi.auto='xrandr --output $HDMI_SCREEN --auto'
alias x.hdmi.of='xrandr --output $HDMI_SCREEN --off'
alias x.hdmi.port='xrandr --output $HDMI_SCREEN --rotate left'
alias x.hdmi.normal='xrandr --output $HDMI_SCREEN --rotate normal'
alias x.hdmi.1080='xrandr --output $HDMI_SCREEN --mode 1920x1080'

# DisplayPort connection
alias x.dp.auto='xrandr --output $DP_SCREEN --auto'
alias x.dp.of='xrandr --output $DP_SCREEN --off'
alias x.dp.port='xrandr --output $DP_SCREEN --rotate left'
alias x.dp.normal='xrandr --output $DP_SCREEN --rotate normal'
alias x.dp.1080='xrandr --output $DP_SCREEN --mode 1920x1080'

#---------------------------------------
# Laptop + 1 Monitor
#---------------------------------------

#------------------
# HDMI connection (Left: Monitor, Right: Laptop)
#------------------

alias x.hdmi.laptop='xrandr --output $HDMI_SCREEN --primary --auto --rotate normal --output $LAPTOP_SCREEN --auto --rotate-normal --right-of $HDMI_SCREEN'
alias x.hdmi.port.laptop='xrandr --output $HDMI_SCREEN --primary --auto --rotate left --output $LAPTOP_SCREEN --auto --right-of $HDMI_SCREEN'

#---------------------------------------
# 2 Monitors
#---------------------------------------

#------------------
# Display Port connections
#------------------

alias x.dp1.dp2='xrandr --output $DP1_SCREEN --primary --auto --rotate normal --output $DP2_SCREEN --auto --rotate normal --right-of $DP1_SCREEN'
alias x.dp1.dp2.port='xrandr --output $DP1_SCREEN --primary --auto --rotate normal --output $DP2_SCREEN --auto --rotate left --right-of $DP1_SCREEN'
alias x.dp1.dp2.primary='xrandr --output $DP1_SCREEN --primary --auto --rotate normal --output $DP2_SCREEN --primary --auto --rotate normal --right-of $DP1_SCREEN'
alias x.dp1.dp2.port.primary='xrandr --output $DP1_SCREEN --auto --rotate normal --output $DP2_SCREEN --primary --auto --rotate left --right-of $DP1_SCREEN'

#------------------
# Mixed connections (DisplayPort + HDMI) (Left: Monitor via DisplayPort, Right: Monitor via HDMI)
#------------------

alias x.dp.hdmi='xrandr --output $DP_SCREEN --primary --auto --rotate normal --output $HDMI_SCREEN --auto --rotate normal --right-of $DP_SCREEN'
alias x.dp.hdmi.port='xrandr --output $DP_SCREEN --primary --auto --rotate normal --output $HDMI_SCREEN --auto --rotate left --right-of $DP_SCREEN'
alias x.dp.hdmi.primary='xrandr --output $DP_SCREEN --primary --auto --rotate normal --output $HDMI_SCREEN --primary --auto --rotate normal --right-of $DP_SCREEN'
alias x.dp.hdmi.port.primary='xrandr --output $DP_SCREEN --auto --rotate normal --output $HDMI_SCREEN --primary --auto --rotate left --right-of $DP_SCREEN'

#---------------------------------------
# 3 Monitors
#---------------------------------------

#------------------
# Mixed connections (HDMI + DisplayPort + DisplayPort) (Leftmost: Monitor via HDMI)
#------------------

alias x.hdmi.dp1.dp2='xrandr --output $HDMI_SCREEN --auto --rotate normal --output $DP1_SCREEN --primary --auto --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --auto --rotate normal --right-of $DP1_SCREEN'
alias x.hdmi.port.dp1.dp2.port='xrandr --output $HDMI_SCREEN --auto --rotate right --output $DP1_SCREEN --primary --auto --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --auto --rotate left --right-of $DP1_SCREEN'
alias x.hdmi.port.dp1.1080.dp2.port='xrandr --output $HDMI_SCREEN --auto --rotate right --output $DP1_SCREEN --primary --mode 1920x1080 --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --auto --rotate left --right-of $DP1_SCREEN'
alias x.hdmi.port.dp1.1080.dp2.port.primary='xrandr --output $HDMI_SCREEN --auto --rotate right --output $DP1_SCREEN --mode 1920x1080 --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --primary --auto --rotate left --right-of $DP1_SCREEN'
alias x.hdmi.port.dp1.1440.dp2.port.primary='xrandr --output $HDMI_SCREEN --auto --rotate right --output $DP1_SCREEN --mode 2560x1440 --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --primary --auto --rotate left --right-of $DP1_SCREEN'
alias x.hdmi.port.dp1.dp2.primary='xrandr --output $HDMI_SCREEN --auto --rotate right --output $DP1_SCREEN --auto --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --primary --auto --rotate normal --right-of $DP1_SCREEN'
alias x.hdmi.port.dp1.dp2.port.primary='xrandr --output $HDMI_SCREEN --auto --rotate right --output $DP1_SCREEN --auto --rotate normal --right-of $HDMI_SCREEN --output $DP2_SCREEN --primary --auto --rotate left --right-of $DP1_SCREEN'

#------------------
# Display Port connections
#------------------

alias x.dp1.dp2.dp3='xrandr --output $DP1_SCREEN --auto --rotate normal --output $DP2_SCREEN --primary --auto --rotate normal --right-of $DP1_SCREEN --output $DP3_SCREEN --auto --rotate normal --right-of $DP2_SCREEN'
alias x.dp1.port.dp2.dp3.port='xrandr --output $DP1_SCREEN --auto --rotate left --output $DP2_SCREEN --primary --auto --rotate normal --right-of $DP1_SCREEN --output $DP3_SCREEN --auto --rotate left --right-of $DP2_SCREEN'
alias x.dp1.port.dp2.dp3.primary='xrandr --output $DP1_SCREEN --auto --rotate left --output $DP2_SCREEN --auto --rotate normal --right-of $DP1_SCREEN --output $DP3_SCREEN --primary --auto --rotate normal --right-of $DP2_SCREEN'
alias x.dp1.port.dp2.dp3.port.primary='xrandr --output $DP1_SCREEN --auto --rotate left --output $DP2_SCREEN --auto --rotate normal --right-of $DP1_SCREEN --output $DP3_SCREEN --primary --auto --rotate left --right-of $DP2_SCREEN'

#---------------------------------------
# Utils - aliases which use other aliases
#---------------------------------------

#------------------
# Commented out
#------------------

#alias xland='x.dp.hdmi'
#alias xport='x.dp.hdmi.port'
#alias xlandp='x.dp.hdmi.primary'
#alias xportp='x.dp.hdmi.port.primary'
#alias xland='x.dp1.dp2'
#alias xport='x.dp1.dp2.port'
#alias xlandp='x.dp1.dp2.primary'
#alias xportp='x.dp1.dp2.port.primary'

#------------------
# In use
#------------------

alias xland='x.hdmi.dp1.dp2'
alias xport='x.hdmi.port.dp1.dp2.port'
alias xport.1080='x.hdmi.port.dp1.1080.dp2.port'
alias xport.1440='x.hdmi.port.dp1.1440.dp2.port'
alias xlandp='x.hdmi.port.dp1.dp2.primary'
alias xportp='x.hdmi.port.dp1.dp2.port.primary'

#------------------------------------------------------------------------------
# 26. Misc
#------------------------------------------------------------------------------

# count files in the directory:
alias cf='setopt CSH_NULL_GLOB; files=(*); echo ${#files[@]};'
# count only hidden files in the directory:
alias cfa='setopt CSH_NULL_GLOB; files=(.*); echo ${#files[@]};'

alias dot='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
alias empty='truncate -s 0'
alias getkey='gpg --keyserver keyserver.ubuntu.com --recv'
alias immutable='sudo chattr +i'
alias mutable='sudo chattr -i'
alias rl='readlink -f'
# used in a pipe, ... | rows
alias rows='tr "\\n" " "'
alias tag='ctags -R .'
alias wl='wc -l'
alias xres.show='xrdb -query -all'

#------------------------------------------------------------------------------
# 27. Temporary (maybe they will stick)
#------------------------------------------------------------------------------

#---------------------------------------
# AWK
#---------------------------------------
alias awk-1='awk '\''{print $1}'\'
alias awk-2='awk '\''{print $2}'\'
alias awk-3='awk '\''{print $3}'\'
alias awk-4='awk '\''{print $4}'\'
alias awk--4='awk '\''{print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk--3='awk '\''{print $(NF-1?NF-2:0)}'\'
alias awk--2='awk '\''{print $(NF?NF-1:0)}'\'
alias awk--1='awk '\''{print $(NF)}'\'
alias awk--='awk '\''{print $NF}'\'
# ---------------------------------------
alias awk-t-1='awk -F$'\''\t'\'' '\''{print $1}'\'
alias awk-t-2='awk -F$'\''\t'\'' '\''{print $2}'\'
alias awk-t-3='awk -F$'\''\t'\'' '\''{print $3}'\'
alias awk-t-4='awk -F$'\''\t'\'' '\''{print $4}'\'
alias awk-t--4='awk -F$'\''\t'\'' '\''{print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-t--3='awk -F$'\''\t'\'' '\''{print $(NF-1?NF-2:0)}'\'
alias awk-t--2='awk -F$'\''\t'\'' '\''{print $(NF?NF-1:0)}'\'
alias awk-t--1='awk -F$'\''\t'\'' '\''{print $(NF)}'\'
alias awk-t--='awk -F$'\''\t'\'' '\''{print $NF}'\'
# ---------------------------------------
alias awk-c-1='awk -F: '\''{print $1}'\'
alias awk-c-2='awk -F: '\''{print $2}'\'
alias awk-c-3='awk -F: '\''{print $3}'\'
alias awk-c-4='awk -F: '\''{print $4}'\'
alias awk-c--4='awk -F: '\''{print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-c--3='awk -F: '\''{print $(NF-1?NF-2:0)}'\'
alias awk-c--2='awk -F: '\''{print $(NF?NF-1:0)}'\'
alias awk-c--1='awk -F: '\''{print $(NF)}'\'
alias awk-c--='awk -F: '\''{print $NF}'\'
# ---------------------------------------
alias awk-s-1='awk -F/ '\''{print $1}'\'
alias awk-s-2='awk -F/ '\''{print $2}'\'
alias awk-s-3='awk -F/ '\''{print $3}'\'
alias awk-s-4='awk -F/ '\''{print $4}'\'
alias awk-s--4='awk -F/ '\''{print $((NF-1)&&(NF-2)?NF-3:0)}'\'
alias awk-s--3='awk -F/ '\''{print $(NF-1?NF-2:0)}'\'
alias awk-s--2='awk -F/ '\''{print $(NF?NF-1:0)}'\'
alias awk-s--1='awk -F/ '\''{print $(NF)}'\'
alias awk-s--='awk -F/ '\''{print $NF}'\'

# A trailing space in VALUE causes the next word to be checked for
# alias substitution when the alias is expanded.
alias xargs='xargs '
alias cl='clear'
alias d='clear'
alias c-='c "$OLDPWD"'
alias -- -='c "$OLDPWD"'
alias l='ls'
alias r='ranger'
alias ink='inkscape'
alias scc='svn copy'
alias f='fzf'
alias h='head'
alias ll='copy'
alias g='grep'
alias t='tail'
alias vvim='export VIMINIT="set nocp | source ${XDG_CONFIG_HOME}/vim/vimrc"; \vim'
alias ds='dot status'
alias dsr='dot restore'
alias dsd='dot diff'
alias dsa='dot add'
alias mann='MANPAGER=less; man '
alias tmux.which="tmux display-message -p '#S'"
alias sca='svn cat'
alias th='thunar .'
alias br='vim ~/.bashrc'
alias fld='fold -w 80 -s'
alias pir='pip install -r requirements.txt'
alias show='sqlitebrowser'
alias wik='cd $DOWNLOADS/wikis'
alias tmux.clean='tmux ls | grep -v attached | cut -d: -f1 | xargs -I{} tmux kill-session -t {}'
alias tls='tmux ls'
# Similar text can be shown with `man perlrun`
alias prun='perldoc perlrun'
alias play='mpv'
alias ppi='pip install'
alias wpi='which pip'
alias vi='venv.init'
alias ppir='pip install -r requirements.txt'
alias san='svn add -N'
alias dsc='dot commit'
alias dsp='dot push'
alias win='wmctrl -l'
alias winx='wmctrl -lx'
alias wing='wmctrl -l -G'
alias dsdc='dot diff --staged'
alias dsu='dot status -u .'
