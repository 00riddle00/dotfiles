
# DOTFILES COMMANDS
alias dot='cd $DOTFILES_DIR'
alias arp='v $DOTFILES_DIR/scripts/archlinux_post_install/packages_main_repos'
alias aur='v $DOTFILES_DIR/scripts/archlinux_post_install/packages_aur'
alias dotm='cd $DOTFILES_DIR/scripts/manage_dotfiles'
alias ig='v $DOTFILES_DIR/.gitignore'
alias she='cd $SHELL_SCRIPTS_DIR'
alias auk='$SHELL_SCRIPTS_DIR/autokey.sh'
alias theme.matrix='$SHELL_SCRIPTS_DIR/themes/matrix/run.sh'
alias theme.riddle='$SHELL_SCRIPTS_DIR/themes/riddle/run.sh'

# MAIN USER COMMANDS

## navigation
alias main='cd $MAIN_HOME/main'
alias bak='cd $MAIN_HOME/backups'
alias dag.dir='cd $MAIN_HOME/lxc/dag-builder/ && venv'
alias xconf='cd $MAIN_HOME/.config/xfce4/xfconf/xfce-perchannel-xml'
alias scard='cd $MAIN_HOME/osos/scard/'
alias sca='cd $MAIN_HOME/VirtualBox\ VMs/scard-api'
alias vi='cd $MAIN_HOME/VirtualBox\ VMs/'
alias viu='cd $MAIN_HOME/VirtualBox\ VMs/ && vu'
alias vis='cd $MAIN_HOME/VirtualBox\ VMs/ && vs'
alias op='cd $MAIN_HOME/.config/openbox'
alias pro='cd $MAIN_HOME/pro'
alias sec='cd $MAIN_HOME/.sec'
alias notes='cd $NOTES'
alias to='cd $MAIN_HOME/.todo/'
alias ahl='cd $MAIN_HOME/pro/ahl.360/ahl360-api'
alias upd='cp $NOTES/tmp1/360_swagger.yml api.yml'
alias amos='cd $MAIN_HOME/langs/hebrew/amos_oz'
alias hlsaves='cd $MAIN_HOME/.local/share/Steam/steamapps/common/Half-Life\ 2/hl2/save'
alias wiki='cd $MAIN_HOME/Dropbox/sync/gtd/content/pages/terahyde/wiki'
alias drop='cd $DROPBOX'
alias drop.phone='cd $MAIN_HOME/Dropbox/sync/phone'
alias drop.bak='cd $MAIN_HOME/Dropbox/sync/backup'
alias keep='cd $KEEP && keepass 8gb.kdbx'
alias can='cd $CANDY'
alias sync='cd $SYNC'
alias cs='cd $MAIN_HOME/CS'
#alias stat='cd $MAIN_HOME/pro/statybininkai'
alias ads='cd $MAIN_HOME/CS/2_semester/ads'
alias tmp='cd $MAIN_HOME/tmp1'
alias tmp1='cd $MAIN_HOME/tmp1'
alias tmp2='cd $MAIN_HOME/tmp2'
alias tmp3='cd $MAIN_HOME/tmp3'
alias tmp4='cd $MAIN_HOME/tmp4'
alias tmp5='cd $MAIN_HOME/tmp5'
alias tmp6='cd $MAIN_HOME/tmp6'
alias tmp7='cd $MAIN_HOME/tmp7'
alias tmp8='cd $MAIN_HOME/tmp8'
alias dok='cd $MAIN_HOME/docker'
alias cl='cd $MAIN_HOME/c_lang/LCTHW'
alias di='cd $MAIN_HOME/VirtualBox\ VMs/dienynas/app'
alias sca='cd $MAIN_HOME/VirtualBox\ VMs/scard-api/'
alias gri='cd $MAIN_HOME/VirtualBox\ VMs/grigiskes-api/app'
alias u2='cd $MAIN_HOME/CS/2_semester/programavimas_c/code/U2'
alias dw='cd $MAIN_HOME/Downloads/'

## file editing commands
alias res='v $MAIN_HOME/.Xresources'
alias tmuxr='v $MAIN_HOME/.tmux.conf '
alias term='v $MAIN_HOME/.config/terminator/config'
alias tintrc='v $MAIN_HOME/.config/tint2/tint2rc'
alias vrc='v $MAIN_HOME/.vimrc'
alias ic='v $MAIN_HOME/.config/i3/config'
alias xi='v $MAIN_HOME/.xinitrc'
alias zr='v $MAIN_HOME/.zsh/.zshrc'
alias al='v $ZDOTDIR/aliases.zsh'
alias fn='v $ZDOTDIR/functions.zsh'
alias gtk='v $MAIN_HOME/.gtkrc-2.0'
alias mim='v $MAIN_HOME/.config/mimeapps.list'
alias vr='v $MAIN_HOME/.vimrc'
alias br='v $MAIN_HOME/.bashrc'
alias termc='v $MAIN_HOME/.config/terminator/config'
alias start='v $MAIN_HOME/.config/openbox/autostart.sh'
alias rc='v $MAIN_HOME/.config/openbox/rc.xml'
alias menu='sudo v $MAIN_HOME/.config/openbox/menu.xml'

## other commands
alias ch='s chown -R $MAIN_USER:$MAIN_USER'
alias pic='scrot -s $MAIN_HOME/Screenshots/screenshot-%F-%H%M%S.png'
alias mchef='$MAIN_HOME/programs/mongochef-4.0.4-linux-x64-dist/bin/mongochef.sh'
#alias ww='python $MAIN_HOME/welcome.py'
alias hi='mpg123 $MAIN_HOME/ca | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'
alias tb='tail -n 20 $ZDOTDIR/aliases.zsh'
alias del="sed -i '$ d' $ZDOTDIR/aliases.zsh"
alias t='$MAIN_HOME/.todo/todo.sh'
alias air='source $MAIN_HOME/pro/env/bin/activate && cd $MAIN_HOME/airflow'
alias and='cp $MAIN_HOME/Dropbox/sync/android/\(a\)notes/notes.txt $MAIN_HOME/Dropbox/sync/gtd/content/pages/tmp/android.md'
alias kan='cat $MAIN_HOME/pro/fl/social/kan.js | xclip'
alias xres.merge='xrdb -merge $MAIN_HOME/.Xresources'
alias xres.restart='xrdb $MAIN_HOME/.Xresources'
alias xres.show='xrdb -query -all'
alias xdefaults='xrdb -merge $MAIN_HOME/.Xdefaults'
alias anv='source $MAIN_HOME/venvs/ahl.360/bin/activate'
alias key='eval $(ssh-agent -s) && ssh-add $MAIN_HOME/.ssh/id_rsa'
alias autostart='$MAIN_HOME/.config/openbox/autostart.sh'


# CURRENT USER COMMANDS
## there has been no need so far


# SYSTEMWIDE COMMANDS

## various commands
alias te='v tests.py'
alias doker='sudo systemctl start docker.service'
alias reb='make rebuild'
alias exe='./main.exe'
alias ya='trizen'
alias yaup='trizen -Syu --aur --noconfirm'
alias stop='killall mpg123'
alias genkeys='cpr tmp1/keys2.xml .config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml && cpr tmp1/keys2.xml /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml'
alias xout='xfce4-session-logout'
alias cki='conky -c .conky/stats && conky -c .conky/conkyrc_HUD && conky -c .conky/archconky'
alias ckil='killall conky'
alias whatip='curl http://icanhazip.com'
alias stopit='killall mpg123'
alias kil='sudo kill -9'
alias xfce='exec xfce4-session'
alias au='ps aux | grep -i'
alias phone='jmtpfs ~/.phone'
alias unphone='umount ~/.phone'
alias tm='conky -c .conky/archconky &'
alias um='sudo umount /dev/sdb1'
alias il='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il'
alias ru='setxkbmap ru phonetic'
alias de='setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,de'
alias mk='./make_zip.sh paysera_test'
alias von='s ipsec start && s ipsec up JIRA && s ipsec up MBS'
alias von2='s ipsec start && s ipsec up JIRA && s ipsec up MBS && s ipsec up SAMBA'
alias vof='s ipsec down MBS && s ipsec down JIRA'
alias vof2='s ipsec down MBS && s ipsec down JIRA && s ipsec down SAMBA'
alias lsd='lxc-ls -f'
alias ap='ansible-playbook'
alias app='ansible-playbook centos.yml'
alias xplus='light -A 10'
alias xminus='light -U 10'
alias ta='t add'
alias getkey='gpg --keyserver keyserver.ubuntu.com --recv '
alias getsums='updpkgsums'
alias makex='s chmod +x'
alias starwars='telnet towel.blinkenlights.nl'
alias outi='i3-msg exit'
alias aplus='amixer set Master 10%+'
alias aminus='amixer set Master 10%-'
alias mute='amixer -q sset Master toggle'
alias dum='du -h --max-depth=1'
alias fonts.update='fc-cache -fv'
alias nn='notes && tree'
alias i='h | grep '
alias trackmem='watch -n 5 du -h --max-depth=1'
alias trackmem2='watch -n 5 du -hs * | sort -h'
alias dusort='du -hs * | sort -h'
alias panh='pandoc -f html -t markdown-raw_html-native_divs-native_spans'
alias gi='v .gitignore'
alias sym='find . -maxdepth 1 -type l -print'
alias video='lspci | grep -e VGA -e 3D'
alias nocaps='sudo dumpkeys | sed "s/\s*58\s*=\s*Caps_Lock/ 58 = Control/" | sudo loadkeys'
alias testas='(dumpkeys | grep keymaps; echo "keycode 58 = Control") | loadkeys'
alias playb='mplayer -vo fbdev2 '
alias ovh='ssh riddle@tomasgiedraitis.com'
alias npm.ls.g='npm list -g --depth=0'
alias npm.ls='npm list --depth=0'
alias files='find . -type d -name "files" -print'
alias cfr='fortune -c | cowthink -f $(find /usr/share/cows -type f | shuf -n 1)'
alias cf='fortune | cowsay'
alias mkinit='sudo mkinitcpio -p linux'
alias mkgrub='sudo grub-mkconfig -o /boot/grub/grub.cfg'
alias show_hidden='setopt -s glob_dots'
# create ssh tunnel to mif and run it in the background
alias mif='ssh -f -N togi3017@uosis.mif.vu.lt -L 5555:linux:3389'

## basic commands
alias b='bash'
alias s='sudo'
alias let='s chmod 755'
alias letr='s chmod -R 755'
alias ls='ls --color=auto'
alias lsr='ls -R'
alias lf='lsblk -f'
alias lsa='ls -a'
alias lsl='ls -l'
alias lsla='ls -al'
alias la='ls -al'
alias lsal='ls -al'
alias las='ls -al'
alias lc='ls | cat'
alias cpr='s cp -r'
alias rmr='s rm -r'  
alias mvr='s mv -r' 
alias grep='grep  --color=auto --exclude-dir={.bzr,CVS,.git,.hg,.svn}'
alias grepi='grep -i'
alias pag='ps aux | grepi'
alias c='clear'
alias kil='sudo kill -9'
alias more='less'
alias clock='s date +%T -s'
alias tar='tar -xvf'
alias q='exit'
alias re='sudo reboot'
alias off='sudo poweroff'
alias h='history'
#alias w='whoami'
alias sa='ssh-add'
alias sl='ssh-add -l'
alias ho='hostname'
alias rl='readlink -f'
alias fl='sudo fdisk -l'
alias ssid='eval $(ssh-agent -s)'

## basic navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias root='cd /'

## navigation
alias serv='cd /var/www'
alias srv='cd /srv/http/'

## pacman
alias orphans='pacman -Qdtd'
alias freeorphans='sudo pacman -Rs $(pacman -Qdtq)'
alias pacfile='sudo pacman -S --noconfirm - --needed <'
alias pacs='sudo pacman -S --noconfirm --needed'
alias pacu='sudo pacman -U'
alias pacr='sudo pacman -R'
alias pacrs='sudo pacman -Rs'
alias up='sudo pacman -Syyu'
alias up2='sudo pacman -Syuu'
alias mps='makepkg -s'
alias mp='makepkg'
alias what='sudo pacman -Qs'
# list all packages with deps
alias pld='sudo pacman -Qq'
# list all packages
alias pl='sudo pacman -Qqe'
# list aur packages
alias plm='sudo pacman -Qqm'
alias is='pld | grepi '
alias ih='ls -la | grepi '

## openbox
alias openbox='exec openbox-session'
alias reop='openbox --reconfigure'
alias wall='feh --bg-scale'
alias out='sudo openbox --exit'

## programs
alias dc='docker-compose'
alias gg='google-chrome-stable'
alias sub='/usr/bin/subl'
alias ne='netctl'
#alias urxvt='xrdb ~/.Xresources && urxvt'
alias libre='libreoffice'
alias show='nomacs'
alias z='zsh'
alias li='libreoffice'
alias cal='gcalcli'
alias mi='nomacs'
alias fire='firefox'
alias pan='pandoc'
#alias r='ranger'
alias vf='vifm'
alias tint='tint2 & disown'
alias x='startx'
alias vbox='virtualbox'
alias fox='firefox'
alias t='thunar ./'
alias tt='sudo thunar ./'
alias rtt='sudo dolphin4 ./'
alias play='vlc'
#alias ag='autokey-gtk'
alias xterm='xterm -r'

## vim
alias v='vim'
alias vv='sudo vim'
alias vimnotes='vim -c "colorscheme molokai | Note config"'
alias plugins='vim +PluginInstall +qall'
alias vimshell='vim -c VimShell'

## emacs
alias emac='emacs --no-window-system'
alias ee='v ~/.emacs.d/init.el'

## tmux
alias ses='cd $MAIN_HOME/.tmux/resurrect'

## git
alias com="ga . && gc -m '.'"
alias push='com && gp'
alias gd='git diff'
alias gdc='git diff --cached'
alias gl='git log'
alias gs='git status'
alias gc='git commit'
alias gp='git push'
alias ga='git add'
alias gb='git branch'
alias gch='git checkout'
alias glg='git lg'
alias grc='git rm -r --cached'
alias gu='git restore --staged'

## vagrant
alias vu='vagrant up'
alias vs='vagrant ssh'

## databases
alias post='sudo systemctl start postgresql'
alias pg='sudo -u postgres psql postgres'
alias pgm='psql -d biblio -U togi3017'
# alias mif='psql -d biblio -U togi3017 -f input.sql -o output.res && cat output.res'
alias mysqlon='sudo systemctl start mysqld'
alias mysqlr='mysql -u root -p'
alias mysqlri='mysql -u user -p'
alias apache='sudo systemctl start httpd.service'
alias reapache='systemctl restart httpd'

## lan
alias ree='ifdown eth0 && ifup eth0'
alias pp='ping -c 3 www.google.com'
alias net='sudo systemctl start dhcpcd@enp9s0.service'
alias netw='sudo systemctl start dhcpcd@enp2s0.service'

## wifi
alias wpa='wpa_supplicant -Dnl80211 -iwlan0 -c/etc/wpa_supplicant/wpa_supplicant.conf'
alias renet=' service networking restart && /etc/init.d/networking restart'
alias rew='ifdown wlan0 && ifup wlan0'
alias wnet='sudo systemctl start dhcpcd@wlp8s0.service'
alias wifion='sudo ip link set wlp8s0 up'
alias wifiof='sudo ip link set wlp8s0 down'
alias wpah='sudo wpa_supplicant -B -i wlp8s0 -c /etc/wpa_supplicant/home.conf'
alias wifih='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start home'
alias wifie='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start eduroam'
alias wifid='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start donatas'
alias wpam='sudo wpa_supplicant -B -i wlp8s0 -c /etc/wpa_supplicant/modem.conf'
alias wpad='sudo wpa_supplicant -B -i wlp8s0 -c /etc/wpa_supplicant/donatas.conf'
alias wifim='sudo ip link set wlp8s0 up && sudo systemctl start dhcpcd@wlp8s0.service && sudo netctl start modem'
alias ww='sudo netctl start wlp8s0-Telia-63E82B-Greitas'
alias ws='sudo netctl start sodas'
alias we='sudo netctl start eduroam'
alias wk='sudo netctl start wlp8s0-andkarGreitasis'
alias wz='sudo netctl start wlp8s0-ZundaGuest'
alias essid='iwconfig'

## touchpad
alias ton='synclient TouchpadOff=0'
alias tof='synclient TouchpadOff=1'

## screen setup
alias xthree='xrandr --output VGA-1 --auto --output $LAPTOP_SCREEN  --auto left-of VGA-0 --output $HDMI_SCREEN --auto --left '
alias xl='xrandr --output VGA-0 --rotate left'
alias xn='xrandr --output VGA-0 --rotate normal'
alias xport='xrandr --output $HDMI_SCREEN --auto --rotate left --output $LAPTOP_SCREEN --auto --right-of $HDMI_SCREEN'
alias xland='xrandr --output $HDMI_SCREEN --auto --rotate normal --output $LAPTOP_SCREEN --auto --right-of $HDMI_SCREEN'
alias xof='xrandr --output $LAPTOP_SCREEN --off'
alias xon='xrandr --output $LAPTOP_SCREEN --auto'

## python
alias p='python'
alias pel='python -m pelican.server'
alias condaenv='source /opt/anaconda/bin/activate /opt/anaconda/'
alias venv='source ../venv/bin/activate'
alias senv='source venv/bin/activate'
alias qenv='deactivate'
alias pu='s pip uninstall'

# java
alias j='java'
alias jc='javac'
alias jcl='rm *.class'

## django
alias mig='pmp makemigrations && pmp migrate'
alias pmp='python manage.py'
alias cs='python manage.py collectstatic --noinput'
alias runs='python manage.py runserver'

# servers
alias py.server='python3 -m http.server 8000'
alias light.server='light-server -s . -p 8000 -c config.json'
alias node.server='httpserver'

## debian
alias dp='sudo dpkg -i'
alias upg='sudo apt-get upgrade'
alias aptr='sudo apt-get remove'
alias dl='dpkg -l'
alias upp='sudo apt-get update'
alias apt='sudo apt-get install'
alias ureapache='sudo systemctl restart apache2'

## clipboard
alias xclip='xclip -selection clipboard'
alias xclip1='xclip -selection primary'
alias xclip2='xclip -selection secondary'

############
# TEMPORARY
############

## c lang
#alias ms='make rebuild'
alias vl='valgrind'
alias vt='valgrind --track-origins=yes'
alias vlt='valgrind --track-origins=yes --leak-check=full'
alias vll='vlt --leak-check=full --show-leak-kinds=all'
alias vllv='vlt --leak-check=full --show-leak-kinds=all -v'
alias gdb_super='gdb --batch --ex run --ex bt --ex q --args'

alias ppp='cd /home/riddle/CS/1_Semestras/Programavimas_C/'
alias ads='cd /home/riddle/CS/2_Semestras/Algoritmai_ir_Duomenu_Strukturos/'

#alias mm='gcc -g logfind.c -o logfind'
alias mm='make pratybos12'
alias m='make pratybos12'
#alias run='./logfind hello ./'
alias run='./program db.dat'
alias r='run'
#alias clean='rm logfind'
alias clean='rm pratybos12'
alias kol='vll ./pratybos12'

#alias ccc='cd /home/riddle/CS/2_Semestras/Programavimas_CPP'
alias ccc='cd /home/riddle/CS/2_Semestras/Programavimas_CPP/laborai_git/namu_darbas_1'



alias nnn='cd /home/riddle/CS/1_Semestras/Programavimas_C/laborai_git/mano_laborai_2017/namu_darbas1'
alias tag='ctags -R .'
alias aaa='cd /home/riddle/CS/2_Semestras/Algoritmai_ir_Duomenu_Strukturos/laborai_git/mano_laborai_2018/namu_darbas_1'
alias copy='cp ~/tmp3/pratybos2.c  ./'
alias nc='ncmpcpp'
#alias ms='make rebuild && ./demo'
alias ms='make *'
alias ra='ranger'
alias w='vim -u ~/.vimrc-essential'
alias le='killall xscreensaver && xresources && xscreensaver -no-splash &'
alias watchh='watch "du -hs * | sort -h"'
alias hak='ssh root@85.206.145.19'
alias ua='uname -a'
alias charge='$SHELL_SCRIPTS_DIR/battery.sh && acpi'
alias cg='acpi'
alias yd='youtube-dl'
alias ydn='youtube-dl --no-playlist' 
alias ydna='youtube-dl --no-playlist --extract-audio --audio-format mp3'
alias yf='yasm -fbin'
alias hhh='yasm -fbin hh.asm -o hh.com'
alias power='upower -i /org/freedesktop/UPower/devices/battery_BAT1 | grep percentage'
alias unrar='unrar x'

#sed
alias allow_only_alpha_and_spaces="sed '/^[[:alpha:] ]*$/!d' GL.md > GL2.md"

alias ggp='gprolog'
alias octave='octave --gui && bg'
alias pak='cd $DOTFILES_DIR/scripts/archlinux_post_install/'



alias lex='cd /home/riddle/pro/uni-compilers/lab2'

alias stat="systemctl status httpd"


alias kiek="wc -l"

alias g1='git log --no-merges --oneline'
alias g2='git log --first-parent'

alias oo='p main.py'
alias uu='cd /home/riddle/pro/uni-compilers'

alias sp.copy='s cp -r ~/pro/schoolproud/core/{,.}* ./'

alias xr='vim ~/.xinitrc'
alias xres='vim ~/.Xresources'

alias zdot='cd ~/.zsh'
alias mm='neomutt'
