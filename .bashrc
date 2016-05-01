# Master .bashrc file for personal laptop running Arch Linux

if [ $(tty) == "/dev/tty1" ]; then
startx
fi

# Turn off Touchpad 
synclient TouchpadOff=1

# If not running interactively, don't do anything
[[ $- != *i* ]] && return


export TERM=terminator
export PS1="\[\e[1;32m\][\u@\W]\[\e[1;36m\]$\[\033[0m\] "
export PAGER=less

setxkbmap -option grp:alt_shift_toggle us,lt
setxkbmap -option caps:escape

archey 

eval $(dircolors ~/.dircolors)

# Vi everything
set -o vi


# bash
alias b='bash'
alias s='sudo'
alias let='s chmod 777'
alias letr='s chmod -R 777'
alias ls='ls --color=auto'
alias lsr='ls -R'
alias lf='lsblk -f'
alias lsl='ls -l'
alias lsa='ls -a'
alias lc='ls | cat'
alias cpr='s cp -r'
alias rmr='s rm -r'
alias mvr='s mv -r'
alias grepi='grep -i'
alias pag='ps aux | grepi'
alias c='clear'
alias kil='kill -9'
alias more='less'
alias clock='s date +%T -s'
alias tar='tar -xvf'
alias q='exit'
alias re='reboot'
alias off='poweroff'

# combine cd & ls
function cdd() { cd $1; ls;}

# navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias root='cd /'

alias app='cd /home/riddle/VirtualBox\ VMs/dienynas/app'
alias u2='cd /home/riddle/CS/2_semester/programavimas_c/code/U2'
alias dw='cd /home/riddle/Downloads/'
alias srv='cd /srv/http/'
alias del='cd ~/deluge'

# pacman
alias pacs='sudo pacman -S' 
alias pacu='sudo pacman -U'
alias pacr='sudo pacman -R'
alias pacrs='sudo pacman -Rs'
alias up='sudo pacman -Syu'
alias mps='makepkg -s'
alias mp='makepkg'
alias y='yaourt'
alias what='sudo pacman -Qs'
alias pl='sudo pacman -Qe'
alias pld='sudo pacman -Q'

# openbox
alias openbox='exec openbox-session'
alias reop='openbox --reconfigure'
alias wall='feh --bg-scale'
alias start='vim ~/.config/openbox/autostart.sh'
alias rc='sudo vim ~/.config/openbox/rc.xml'
alias menu='sudo vim ~/.config/openbox/menu.xml'
alias out='sudo openbox --exit'

# config
alias vr='vim ~/.vimrc'
alias br='vv ~/.bashrc'
alias term='vv .config/terminator/config'
alias mkinit='sudo mkinitcpio -p linux'
alias mkgrub='sudo grub-mkconfig -o /boot/grub/grub.cfg'

# programs
alias x='startx'
alias vbox='virtualbox'
alias au='audacity'
alias read='acroread'
alias chrome='google-chrome-stable'
alias fox='firefox'
alias v='vim'
alias vv='sudo vim'
alias tt='sudo dolphin4 ./'
alias play='vlc'
alias t='thunar'
alias ag='autokey-gtk'

# git
alias gd='git diff'
alias gl='git log'
alias gs='git status'
alias gc='git commit'
alias gp='git push'
alias ga='git add'
alias gr='git rm'
alias gb='git branch'
alias gch='git checkout'

# vagrant 
alias vu='vagrant up'
alias vs='vagrant ssh'

# programs & actions
alias cfr='fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'
alias cf='fortune | cowsay' 

# databases
alias post='sudo systemctl start postgresql'
alias pg='sudo -u postgres psql postgres'
alias mysqlon='sudo systemctl start mysqld'
alias mysqlr='mysql -u root -p'
alias mysqlri='mysql -u riddle -p'
alias apache='sudo systemctl start httpd.service'
alias reapache='systemctl restart httpd'

# inet
alias net='sudo systemctl start dhcpcd@enp9s0.service'
alias wn='sudo netctl start Namai7'
alias wr='sudo netctl start Riddle00'
alias wo='sudo netctl start OSOS'
alias wifi='sudo wifi-menu'
alias wifion='sudo ip link set wlp8s0 up'
alias nowifi='sudo ip link set wlp8s0 down'
alias pp='ping -c 3 www.google.com'
alias pings='ping -c 3 8.8.8.8'

# touchpad
alias ton='synclient TouchpadOff=0'
alias tof='synclient TouchpadOff=1'

# screen setup
alias xport='xrandr --output HDMI-1 --auto --rotate left --output eDP-1 --auto --right-of HDMI-1'
alias xland='xrandr --output HDMI-1 --auto --rotate normal --output eDP-1 --auto --right-of HDMI-1'
alias xon='xrandr --output HDMI-1 --auto --rotate normal --output eDP-1 --auto --right-of HDMI-1'
alias xof='xrandr --output HDMI-1 --off'


# c lang
alias t='./test'
alias ms='make test'
alias vt='vlt ./test'
alias vl='valgrind'
alias vlt='valgrind --track-origins=yes --leak-check=full'
alias vll='vlt --leak-check=full --show-leak-kinds=all ./test'
alias vllv='vlt --leak-check=full --show-leak-kinds=all -v ./test'

# python
alias python='python3.5'
alias p='python3.5'
alias condaenv='source /opt/anaconda/bin/activate /opt/anaconda/'

# django
alias cs='python manage.py collectstatic --noinput'
alias venv='source ../env/bin/activate'
alias qenv='deactivate'
alias db='python manage.py dbshell'
alias syncdb='python manage.py syncdb'
alias runs='python manage.py runserver'


#################################################

alias pu='s pip uninstall'
alias mim='vv /home/riddle/.config/mimeapps.list'
alias glg='git lg'
alias ads='cd /home/riddle/CS/2_semester/ads'
alias gpo='git push origin tomo_pakeitimai'

alias tmp='cd ~/tmp1'
alias te='v tests.py'



