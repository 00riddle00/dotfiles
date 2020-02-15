# ============================================
#  Note: many of these aliases are not being 
#  used anymore or are being used very rarely, 
#  however, I still keep them there as a sort
#  of command-wiki, since quite a few times
#  it turned out to be pretty useful to look 
#  up some stuff that I aliased a while ago.
# ============================================

# assembler
alias hhh='yasm -fbin hh.asm -o hh.com'
alias yf='yasm -fbin'

# cd
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias root='cd /'

# dotfiles
alias arp='vim $SHELL_SCRIPTS_DIR/archlinux_post_install/packages_main_repos'
alias aur='vim $SHELL_SCRIPTS_DIR/archlinux_post_install/packages_aur'
alias dot='cd $DOTFILES_DIR'
alias dotm='cd $SHELL_SCRIPTS_DIR/manage_dotfiles'
alias ig='vim $DOTFILES_DIR/.gitignore'
alias she='cd $SHELL_SCRIPTS_DIR'

# emacs
alias ee='vim ~/.emacs.d/init.el'
alias emac='emacs --no-window-system'

# git
alias com="git add . && git commit -m '.'"
alias ga='git add'
alias gb='git branch'
alias gc='git commit'
alias gch='git checkout'
alias gd='git diff'
alias gdc='git diff --cached'
alias gf='git clean'
alias gitlg.firstparent='git log --first-parent'
alias gitlg.nomerges='git log --no-merges --oneline'
alias gl='git log'
alias glg='git lg'
alias gp='git push'
alias grc='git rm -r --cached'
alias gs='git status'
alias gu='git restore --staged'
alias push='com && gp'

# info output
alias fl='sudo fdisk -l'
alias info.video='lspci | grep -e VGA -e 3D'
alias lf='lsblk -f'
alias ssid='eval $(ssh-agent -s)'

# java
alias j='java'
alias jc='javac'
alias jcl='rm *.class'

# javascript
alias npm.ls='npm list --depth=0'
alias npm.ls.g='npm list -g --depth=0'

# launch GUI programs
alias fire='firefox'
alias gg='google-chrome-stable'
alias li='libreoffice'
alias libre='libreoffice'
alias mi='nomacs'
alias play='vlc'
alias sub='/usr/bin/subl3'
alias t='thunar ./'
alias tint='tint2 & disown'
alias tt='sudo thunar ./'
alias vbox='virtualbox'
alias xterm='xterm -r'

# openbox
alias out='sudo openbox --exit'
alias reop='openbox --reconfigure'
alias wall='feh --bg-scale'

# run shell scripts
alias autostart='$MAIN_HOME/.config/openbox/autostart.sh' # in sageMath shell
alias charge='$SHELL_SCRIPTS_DIR/battery.sh'
alias pyc='$MAIN_HOME/.local/share/JetBrains/Toolbox/apps/PyCharm-P/ch-0/193.5662.61/bin/pycharm.sh'
alias theme.matrix='$SHELL_SCRIPTS_DIR/themes/matrix/run.sh'
alias theme.riddle='$SHELL_SCRIPTS_DIR/themes/riddle/run.sh'
alias rms.say='$SHELL_SCRIPTS_DIR/cowsay/rms_say.sh'
alias rms.say.gnu='$SHELL_SCRIPTS_DIR/cowsay/rms_say_gnu.sh'

# ssh
alias sa='ssh-add'
alias sl='ssh-add -l'
alias mif='ssh -f -N togi3017@uosis.mif.vu.lt -L 5555:linux:3389' # create ssh tunnel to mif and run it in the background

# standard cmds
alias c='clear'
alias cpr='cp -r'
alias grep='grep  --color=auto --exclude-dir={.bzr,CVS,.git,.hg,.svn}'
alias grepi='grep -i'
alias h='history'
alias more='less'
alias off='sudo poweroff'
alias q='exit'
alias re='sudo reboot'
alias rmr='sudo rm -r'  
alias s='sudo'
alias tar='tar -xvf'
alias z='zsh'

# vagrant
alias vs='vagrant ssh'
alias vu='vagrant up'

# various 
alias mutable='sudo chattr -i'
alias immutable='sudo chattr +i'
alias aminus='amixer set Master 10%-'
alias aplus='amixer set Master 10%+'
alias cf='fortune | cowsay'
alias cfr='fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'
alias cg='acpi'
alias clock.sync='sudo ntpd -qg'
alias dusort.all='du -h --max-depth=1 | sort -h' # including hidden
alias dusort='du -hs * | sort -h'
alias fonts.update='fc-cache -fv'
alias fonts.current='fc-match --verbose Sans'
alias getkey='gpg --keyserver keyserver.ubuntu.com --recv'
# alias getkey='gpg --keyserver hkps://hkps.pool.sks-keyservers.net --recv'
alias getsums='updpkgsums'
alias ggp='gprolog'
alias hh='htop'
alias key='eval $(ssh-agent -s) && ssh-add $MAIN_HOME/.ssh/id_rsa'
alias mkgrub='sudo grub-mkconfig -o /boot/grub/grub.cfg'
alias mkinit='sudo mkinitcpio -p linux'
alias mute='amixer -q sset Master toggle'
alias nn='cd $NOTES && tree'
alias nocaps='sudo dumpkeys | sed "s/\s*58\s*=\s*Caps_Lock/ 58 = Control/" | sudo loadkeys'
alias phone='jmtpfs ~/.phone'
alias pic='scrot -s $MAIN_HOME/Screenshots/screenshot-%F-%H%M%S.png'
alias power='upower -i /org/freedesktop/UPower/devices/battery_BAT1 | grep percentage'
alias ra='ranger'
alias rl='readlink -f'
alias show_hidden='setopt -s glob_dots'
alias starwars='telnet towel.blinkenlights.nl'
alias tag='ctags -R .'
alias tb='tail -n 20 $ZDOTDIR/aliases.zsh'
alias timezone.update='timedatectl set-timezone "$(curl --fail https://ipapi.co/timezone)"'
alias trackmem.hidden='watch -n 5 "du -h --max-depth=1 | sort -h"'
alias trackmem='watch -n 5 "du -hs * | sort -h"'
alias unphone='umount ~/.phone'
alias unrar='unrar x'
alias vf='vifm'
alias wl="wc -l"
alias xminus='light -U 10'
alias xplus='light -A 10'
alias xres.merge='xrdb -merge $MAIN_HOME/.Xresources'
alias xres.restart='xrdb $MAIN_HOME/.Xresources'
alias xres.show='xrdb -query -all'
alias yd='youtube-dl'
alias ydn='youtube-dl --no-playlist' 
alias ydna='youtube-dl --no-playlist --extract-audio --audio-format mp3'

# vim
alias v='vim'
alias vim.plugins='vim +PluginInstall +qall'
alias vv='sudo vim'

## anaconda
alias condaenv='source /opt/anaconda/bin/activate /opt/anaconda/'

## aur
alias ya='yay'
alias ya.install='yay -S'
alias ya.find='yay -Si'
alias yaup='yay -Syu --noconfirm'

## c development
alias gdb.super='gdb --batch --ex run --ex bt --ex q --args'
alias ms='make rebuild'
alias vl='valgrind'
alias vll='vlt --leak-check=full --show-leak-kinds=all'
alias vllv='vlt --leak-check=full --show-leak-kinds=all -v'
alias vlt='valgrind --track-origins=yes --leak-check=full'
alias vt='valgrind --track-origins=yes'

## clipboard
alias xclip='xclip -selection clipboard'
alias xclip.prim='xclip -selection primary'
alias xclip.sec='xclip -selection secondary'

## databases
alias mysqlon='sudo systemctl start mysqld'
alias mysqlr='mysql -u root -p'
alias mysqlri='mysql -u user -p'
alias pg='sudo -u postgres psql postgres'
alias pgm='psql -d biblio -U togi3017'
alias post='systemctl start postgresql'

## django
alias cs='python manage.py collectstatic --noinput'
alias mig='pmp makemigrations && pmp migrate'
alias pmp='python manage.py'
alias runs='python manage.py runserver'

## lan
alias net='systemctl start dhcpcd@enp9s0.service'

## languages
alias de='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,de'
alias il='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il'
alias ru='setxkbmap ru phonetic'

## navigation
alias bak='cd $MAIN_HOME/backups'
alias candy='cd $CANDY'
alias drop.bak='cd $MAIN_HOME/Dropbox/sync/backup'
alias drop.phone='cd $MAIN_HOME/Dropbox/sync/phone'
alias drop='cd $DROPBOX'
alias dw='cd $MAIN_HOME/Downloads/'
alias notes='cd $NOTES'
alias op='cd $MAIN_HOME/.config/openbox'
alias pak='cd $SHELL_SCRIPTS_DIR/archlinux_post_install/'
alias pro='cd $MAIN_HOME/pro'
alias serv='cd /var/www'
alias srv='cd /srv/http/'
alias tmp1='cd $MAIN_HOME/tmp1'
alias tmp2='cd $MAIN_HOME/tmp2'
alias tmp3='cd $MAIN_HOME/tmp3'
alias tmp4='cd $MAIN_HOME/tmp4'
alias tmp5='cd $MAIN_HOME/tmp5'
alias tmp6='cd $MAIN_HOME/tmp6'
alias tmp7='cd $MAIN_HOME/tmp7'
alias tmp8='cd $MAIN_HOME/tmp8'
alias tmp='cd $MAIN_HOME/tmp1'
alias vi='cd $MAIN_HOME/VirtualBox\ VMs/'
alias zdir='cd $ZSH_DIR'
alias zdot='cd $ZSH_DIR'

## network
alias pp='ping -c 3 www.google.com'
alias whatip='curl http://icanhazip.com'
alias wp='watch "ping -c 1 www.google.com"'

## open files to edit with vim
alias al='vim $ZDOTDIR/aliases.zsh'
alias br='vim $MAIN_HOME/.bashrc'
alias fn='vim $ZDOTDIR/functions.zsh'
alias rc='vim $MAIN_HOME/.config/openbox/rc.xml'
alias res='vim $MAIN_HOME/.Xresources'
alias start='vim $MAIN_HOME/.config/openbox/autostart.sh'
alias termc='vim $MAIN_HOME/.config/terminator/config'
alias tintrc='vim $MAIN_HOME/.config/tint2/tint2rc'
alias tmuxr='vim $MAIN_HOME/.tmux.conf '
alias vr='vim $MAIN_HOME/.vimrc'
alias xi='vim $MAIN_HOME/.xinitrc'
alias xres='vim $MAIN_HOME/.Xresources'
alias zenv='vim $MAIN_HOME/.zshenv'
alias zr='vim $MAIN_HOME/.zsh/.zshrc'

## pacman
# --------------------------------------------------------------------------------------------------------------------
### -Q
alias orphans='pacman -Qdtd'
alias is='sudo pacman -Qqe | grepi '     # grep for explicitly installed package
alias isa='sudo pacman -Qq | grepi '     # grep for installed package
alias pl='sudo pacman -Qqe'              # list all explicitly installed packages 
alias pld='sudo pacman -Qq'              # list all packages 
alias plm='sudo pacman -Qqm'             # list foreign packages (mainly from AUR)
alias pac.owner='sudo pacman -Qo'        # who owns the file
alias pac.group='sudo pacman -Qgq'       # list installed packages belonging to a group
alias pac.what='sudo pacman -Qs'         # list local package(s) with description
alias what='sudo pacman -Qs'   
alias pac.deps='sudo pacman -Qi'         # show deps for the given local package
### -S
alias pacfile='sudo pacman -S --noconfirm - --needed <'       # install from file
alias pacs='sudo pacman -S --noconfirm --needed'              # `needed` does not reinstall targets that are up to date
alias pac.group_remote='sudo pacman -Sgq'                     # list packages belonging to a group
alias pac.base='expac -S '%E' base | xargs -n1 | sort'        # list packages depending on `base` metapackage
alias pac.deps_remote='sudo pacman -Si'                       # show deps for the given package
alias pac.find='sudo pacman -Ss'                              # search package. with <regexp>
# removes uninstalled packages from /var/cache/pacman/pkg and cleans unused
# repos in /var/lib/pacman
alias pac.clear='sudo pacman -Sc'
# removes ALL packages from /var/cache/pacman/pkg and ...
alias pac.clear_all='sudo pacman -Scc'
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
### -R
alias freeorphans='sudo pacman -Rs $(pacman -Qdtq)'
alias pacr='sudo pacman -R'
# Avoid using the -d option with pacman. pacman -Rdd package skips dependency checks during package removal. 
# As a result, a package providing a critical dependency could be removed, resulting in a broken system.
alias pac.forcedel='sudo -k pacman -Rdd'
alias pacrs='sudo pacman -Rns' # full removal (+nosave (removes system config file) +deps)
# --------------------------------------------------------------------------------------------------------------------

## process management
alias au='ps aux | grep -i'
alias kil='sudo kill -9'

## python
alias p='python'
alias qenv='deactivate'
alias venv='source venv/bin/activate'

## screen setup
alias xof='xrandr --output $LAPTOP_SCREEN --off'
alias xon='xrandr --output $LAPTOP_SCREEN --auto'
alias xl='xrandr --output $HDMI_SCREEN --rotate left'
alias xn='xrandr --output $HDMI_SCREEN --rotate normal'
alias xland='xrandr --output $HDMI_SCREEN --auto --rotate normal --output $LAPTOP_SCREEN --auto --right-of $HDMI_SCREEN'
alias xport='xrandr --output $HDMI_SCREEN --auto --rotate left --output $LAPTOP_SCREEN --auto --right-of $HDMI_SCREEN'

## server
alias apache='systemctl start httpd.service'
alias reapache='systemctl restart httpd'
alias stat="systemctl status httpd"

## touchpad
alias tof='synclient TouchpadOff=1'
alias ton='synclient TouchpadOff=0'

## wifi
alias wpa='wpa_supplicant -Dnl80211 -iwlan0 -c/etc/wpa_supplicant/wpa_supplicant.conf'
alias wpah='sudo wpa_supplicant -B -i wlp8s0 -c /etc/wpa_supplicant/home.conf'
alias wifih='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start home'
alias wifie='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start eduroam'
alias wifid='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start donatas'
alias wpam='sudo wpa_supplicant -B -i wlp8s0 -c /etc/wpa_supplicant/modem.conf'
alias wpad='sudo wpa_supplicant -B -i wlp8s0 -c /etc/wpa_supplicant/donatas.conf'
alias wifim='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start modem'

alias essid='iwconfig'
alias renet=' service networking restart && /etc/init.d/networking restart'
alias we='sudo netctl start eduroam'
alias wifiof='sudo ip link set wlp8s0 down'
alias wifion='sudo ip link set wlp8s0 up'
alias wnet='sudo systemctl start dhcpcd@wlp8s0.service'

### ls
alias la='ls -al'
alias las='ls -al'
alias lc='ls | cat'
alias ls='ls --color=auto'
alias lsa='ls -a'
alias lsal='ls -al'
alias lsl='ls -l'
alias lsla='ls -al'
alias lsr='ls -R'
alias ih='ls -la | grep -i'
alias lsh='ls -ld .?*'

### permissions
alias ch='sudo chown -R $MAIN_USER:$MAIN_USER'
alias let='chmod 755'
alias letr='chmod -R 755'

# =============
#  projects
# =============

# subscription-demo
alias ve='export VENV=$MAIN_HOME/pro/subscription-demo/env'

alias run='
    rm /home/riddle/pro/subscription-demo/app/subscriptions.sqlite &&
    ve &&
    $VENV/bin/python3 setup.py develop &&
    $VENV/bin/initialize_subscriptions_db development.ini'

alias run2='
    ve &&
    rm -r $VENV &&
    python3 -m venv $VENV &&
    $VENV/bin/pip3 install --upgrade pip setuptools &&
    run &&
    chmod -R +x $VENV &&
    $VENV/bin/pip install -e ".[testing]" &&
    $VENV/bin/pserve development.ini --reload'

#alias test='ve &&$VENV/bin/py.test --cov -q'

alias senv='source $VENV/bin/activate'

# =============
# temp
# =============
# entries appear here after appending output to this file

alias gimp.go='cd $DOTFILES_DIR/xorg/.config/GIMP/2.10/'
alias services.running='systemctl --type=service'
alias services.list='systemctl list-unit-files'
alias services.enabled='systemctl list-unit-files | grep enabled'
alias network.edit='nm-connection-editor' 
alias network.list='nmcli device wifi list'
alias mm='neomutt'
alias r='ranger'
alias gop='gotop'
alias conf='cd ~/.config/'
alias mpv.image='mpv --no-config --pause --vo=tct'
alias mpv.video='mpv --no-config --vo=tct'
alias mpv.youtube='mpv -vo=caca'
alias sk='cd ~/Screenshots'

alias ic='vim $MAIN_HOME/.config/i3/config'
alias kee='cd $DROPBOX/sync/keepass'
alias pacc='sudo vim /etc/pacman.conf'
alias ss='ssh root@192.168.1.244'
alias rt='rtorrent'
alias pls='sudo $(fc -ln -1)'
alias plz='sudo $(fc -ln -1)'

alias red='redshift -P -O'
alias red.norm='redshift -P -O 6500'
alias red.warm='redshift -P -O 5000'
alias t1='i3-msg exec "$TERMINAL -name dropdown_tmuxdd -e tmux" > /dev/null 2>&1'
alias alsi='alsi -a'

alias flame='flameshot gui -p /home/riddle/Screenshots'

alias ss1='ssh test@141.98.10.154'
alias ss2='ssh userv@141.98.10.54 -p 22033'
alias ss3='ssh userv@141.98.10.157 -p 22033'
alias ss4='ssh userv@141.98.10.158 -p 22033'

alias bin='cd $MAIN_HOME/.local/bin'
