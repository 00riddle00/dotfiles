# If not running interactively, don't do anything
[[ $- != *i* ]] && return

archey
setxkbmap -option grp:alt_shift_toggle us,lt
setxkbmap -option caps:escape
set -o vi

TERM=terminator

PS1="\[\e[1;32m\][\u@\W]\[\e[1;36m\]$\[\033[0m\] "

export TERM
export PS1

alias c='clear'

alias cs='python manage.py collectstatic --noinput'

alias play='vlc'

alias what='s pacman -Qs'

alias set='s vim */settings.py'

alias read='acroread'


alias grepi='grep -i'



alias clock='s date +%T -s'
alias a='wmctrl -a' 
alias cki='conky -c .conky/stats && conky -c .conky/conkyrc_HUD && conky -c .conky/archconky'

alias ckil='killall conky'

alias q='exit'

alias venv='source env/bin/activate'
alias qenv='deactivate'


alias chrome='google-chrome-stable'
alias fox='firefox'

# git
alias gl='git log'
alias gs='git status'
alias gc='s git commit'
alias gp='s git push'
alias ga='s git add'
alias gr='s git rm'
alias gb='s git branch'
alias gch='s git checkout'


alias cpr='s cp -r'
alias rmr='s rm -r'
alias mvr='s mv -r'


alias djadmin="cd /usr/local/lib/python3.4/dist-packages/django/contrib/admin/templates/admin"

alias b='bash'
alias let='s chmod 777'
alias letr='s chmod -R 777'
alias pg='sudo -u postgres psql postgres'
alias db='python manage.py dbshell'
alias syncdb='python manage.py syncdb'


alias python='python3'

# ubuntu
function cdl { cd $1; ls;}
alias lf='lsblk -f'
#alias smartgit="/usr/share/smartgit/bin/smartgit.sh"
#alias update="sudo apt-get update"
#alias whatip="curl http://icanhazip.com"
#alias xampp="sudo python /opt/lampp/share/xampp-control-panel/xampp-control-panel.py"
#alias lamp="cd /opt/lampp/htdocs"
#alias apt="sudo apt-get install"
#alias uwifi="wicd-gtk"
#alias serv="cd /var/www"
#alias ureapache="sudo systemctl restart apache2"





# bus
alias bus="cd ~/bus"

# new
alias arch='bash'
alias vrc='vim ~/.vimrc'
alias lsr='ls -R'
alias ww='python ~/welcome.py'
alias vs='vim ~/welcome.py'
alias hi='mpg123 ~/candy/startup3_1.mp3'
alias cfr='fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'
alias cf='fortune | cowsay'
alias p=python3

# openbox
alias reop='openbox --reconfigure'
alias wall='feh --bg-scale'
alias tint='vv ~/.config/tint2/tint2rc'
alias ok='killall mpg123'
alias kil='kill -9'
alias start='vim ~/.config/openbox/autostart.sh'
alias term='vim ~/.config/terminator/config'
alias res='xrandr -s 1920x1080'
alias rc='sudo vim ~/.config/openbox/rc.xml'
alias menu='sudo vim ~/.config/openbox/menu.xml'
alias out='sudo openbox --exit'
alias nets='wicd-client -n'

# general
alias xfce='exec xfce4-session'
alias openbox='exec openbox-session'

alias i='google-chrome-stable'

alias per='sudo chmod 777'

# alias t='thunar'
alias t='dolphin4 ./'
alias tt='sudo dolphin4 ./'

alias lsl='ls -l'
alias lsa='ls -a'
alias lc='ls | cat'
alias ls='ls --color=auto'

alias xl='xrandr --output VGA-0 --rotate left'
alias xn='xrandr --output VGA-0 --rotate normal' 

alias off='poweroff'
alias re='reboot'
alias x='startx'

alias v='vim'
alias vv='sudo vim'
alias s='sudo'

alias mkinit='sudo mkinitcpio -p linux'
alias mkgrub='sudo grub-mkconfig -o /boot/grub/grub.cfg'


# packages
alias tar='tar -xvf'
alias pacs='sudo pacman -S' 
alias pacu='sudo pacman -U'
alias pacr='sudo pacman -R'
alias pacrs='sudo pacman -Rs'
alias up='sudo pacman -Syu'
alias mps='makepkg -s'
alias mp='makepkg'
alias y='yaourt'


# net & servers & databases
alias net='sudo dhcpcd enp2s0'
alias wifi='sudo wifi-menu'
alias apache='sudo systemctl start httpd.service'
alias reapache='systemctl restart httpd'
alias pingg='ping -c 3 www.google.com'
alias pp='ping -c 3 www.google.com'
alias pings='ping -c 3 8.8.8.8'
alias mysqlon='sudo systemctl start mysqld'
alias mysqlr='mysql -u root -p'
alias mysqlri='mysql -u riddle -p'
alias runs='python manage.py runserver'
alias post='sudo systemctl start postgresql'

alias wifion='sudo ip link set wlp1s0 up'
alias nowifi='sudo ip link set wlp1s0 down'


# config
alias br='vim ~/.bashrc'

# dirs
alias r='cd /'
alias d='cd /home/riddle/Desktop/'
alias dw='cd /home/riddle/Downloads/'
alias srv='cd /srv/http/'


if [ $(tty) == "/dev/tty1" ]; then
startx
fi
