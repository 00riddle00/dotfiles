######
# base
######

bash
bzip2
coreutils
cryptsetup
device-mapper
dhcpcd
diffutils
e2fsprogs
file
filesystem
findutils
gawk
gcc-libs
gettext
glibc
grep
gzip
inetutils
iproute2
iputils
jfsutils
less
licenses
linux
logrotate
lvm2
man-db
man-pages
mdadm
nano
netctl
pacman
pciutils
pcmciautils
perl
procps-ng
psmisc
reiserfsprogs
s-nail
sed
shadow
sysfsutils
systemd-sysvcompat
tar
texinfo
usbutils
util-linux
vi
which
xfsprogs

#########
# base-devel
#########

autoconf
automake
binutils
bison
fakeroot
file
findutils
flex
gawk
gcc
gettext
grep
groff
gzip
libtool
m4
make
pacman
pacman
patch
pkg-config
sed
sudo
texinfo
util-linux
which

######
# xorg
######

xorg-apps
xorg-bdftopcf
xorg-docs
xorg-fonts-100dpi
xorg-fonts-75dpi
xorg-fonts-encodings
xorg-font-util
xorg-iceauth
xorg-luit
xorg-mkfontdir
xorg-mkfontscale
xorg-server
xorg-server-common
xorg-server-devel
xorg-server-xdmx
xorg-server-xephyr
xorg-server-xnest
xorg-server-xvfb
xorg-server-xwayland
xorg-sessreg
xorg-setxkbmap
xorg-smproxy
xorg-x11perf
xorg-xauth
xorg-xbacklight
xorg-xcmsdb
xorg-xcursorgen
xorg-xdpyinfo
xorg-xdriinfo
xorg-xev
xorg-xgamma
xorg-xhost
xorg-xinput
xorg-xkbcomp
xorg-xkbevd
xorg-xkbutils
xorg-xkill
xorg-xlsatoms
xorg-xlsclients
xorg-xmodmap
xorg-xpr
xorg-xprop
xorg-xrandr
xorg-xrdb
xorg-xrefresh
xorg-xset
xorg-xsetroot
xorg-xvinfo
xorg-xwd
xorg-xwininfo
xorg-xwud

##########
# drivers
##########

##################
#GPU
##################

# Xorg iesko specific drivers installed for the hardware,
# jei neranda, pirma iesko fbdev, jei ne, iesko vesa.
# Jei neranda, fallbackina i KMS.
# Kad rastu specific drivers, zr. lentele. (AWiki->Xorg).
#
# Open source draiveriu paeiska:
# pacman -Ss xf86-video
#
# Viskas based on:
   xorg-server



xf86vidmodeproto #  X11 Video Mode extension wire protocol
 libxxf86vm # X11 XFree86 video mode extension library

libglvnd # The GL Vendor-Neutral Dispatch library
|
mesa # an open-source implementation of the OpenGL specification

nvidia-utils
    #split:
    opencl-nvidia

nvidia

nvidia-settings
    #split:
    libxnvctrl

nvidia # nvida drivers for linux


# 32 bit graphics
lib32-gcc-libs
lib-32-libglvnd
lib32-zlib

lib32-nvidia-utils
    # split:
    lib32-opencl-nvidia

libxxf86dga #[OPTIONAL?] X11 Direct Graphics Access extension library
lib32-libxxf86dga #[OPTIONAL?] X11 Direct Graphics Access extension library (32 bit)

dar kad patikrinti
glxinfo
glxgears


### INTEL
# required by lib32-mesa:
libxxf86vm
lib32-libxxf86vm

xf86-video-intel
mesa # an open-source implementation of the OpenGL specification
lib32-mesa # an open-source implementation of the OpenGL specification (32-bit)

mesa-demos #[OPTIONAL?] Mesa demos and tools
lib32-mesa-demos #[OPTIONAL?] Mesa demos and tools (32-bit)


videoproto #[OPTIONAL?] X11 Video extension wire protocol

libglade #[OPTIONAL?] Allows you to load glade interface files in a program at runtime

xf86-video-nouveau #[OPTIONAL?] Open Source 2D acceleration driver for nVidia cards

xf86-video-vesa #[OPTIONAL?] X.org vesa video driver


xf86dgaproto #[OPTIONAL?]X11 Direct Graphics Access extension wire protocol

xf86driproto # [OPTIONAL?] X11 DRI extension wire protocol
xf86vidmodeproto # [OPTIONAL?] X11 DRI extension wire protocol


cuda
cudnn

# Touchpad drivers
xf86-input-synaptics






############
# main repos
############

dnsutils
archlinux-keyring
xdotool
geth
tk
samba 
wine
winetricks
playonlinux
rxvt-unicode 
ranger
meld
nitrogen
valgrind
nmap
os-prober
calibre
docker
espeak
puppet
electrum
lshw
dia
gvfs
atom
npm
nodejs
net-tools
gmrun
xsel
strace
vagrant
virtualbox
mousepad
ansible
sshpass
strace
p7zip
cairo-dock
newsbeuter
screen
sc
pidgin
unrar
dosfstools
ctags
tree
finch
httpie
moreutils
pacgraph
alsa-utils
xorg-xinit
wget
curl
bzip2
emacs
mlocate
feh
filezilla
fontconfig
ttf-dejavu
ttf-liberation
firefox
gimp
git
gzip
htop
libreoffice
lxc
lynx
mirage
ntp
qalculate-gtk
screenfetch
scrot
sudo
terminator
thunar
thunar-volman
thunderbird
tmux
tint2
unzip
vim
vlc
wmctrl
xscreensaver
xclip
zip
zsh
xterm
yajl
openbox
adobe-source-code-pro-fonts
deluge
electrum
irssi
vifm
cmus
rtorrent
mutt
pandoc
lftp
mplayer
bc
ack
nethack
cowsay
ncmpcpp
mc
wpa_supplicant
steam
openssh
tig
pulseaudio
pavucontrol
# python packages
python3
python-pip
jupyter-notebook
python-ipywidgets
ipython
# i3 wm
i3-wm
i3lock
i3status
dmenu
# xmonad wm
xmonad


###########
# AUR
###########
package-query
yaourt
copyq
razercfg
autokey
downgrade
keepass
webstorm
pycharm-professional
keepass-plugin-keeagent
googlecl
kpcli
archey3
dropbox
dropbox-cli
fortune
luakit
gcalcli
tightvnc
arduino
teamviewer
google-chrome
conky
grub2-theme-archlinux
strongswan
smartgit
grub-customizer
mist



#############
# from source
#############
sublime-text-3

##########
2018-10-15
##########

ack 2.24-2
adobe-source-code-pro-fonts 2.030ro+1.050it-4
alsa-utils 1.1.6-1
alsi 0.4.7-1
android-tools 9.0.0_r3-1
arduino 1:1.8.7-1
audacity 2.3.0-1
bash 4.4.023-1
binutils 2.31.1-3
breeze-icons 5.50.0-1
bzip2 1.0.6-8
calibre 3.32.0-1
clion 1:2018.2.3-1
clion-cmake 1:2018.2.3-1
clion-gdb 1:2018.2.3-1
clion-jre 1:2018.2.3-1
clion-lldb 1:2018.2.3-1
cmake 3.12.3-1
cmatrix 1.2-1
conky 1.10.8-2
coreutils 8.30-1
cryptsetup 2.0.4-1
ctags 5.8-6
deluge 1.3.15+14+gb8e5ebe82-1
device-mapper 2.02.181-1
dhcpcd 7.0.8-1
dia 0.97.3-4
dialog 1:1.3_20180621-1
diffutils 3.6-1
dmidecode 3.2-1
docker 1:18.06.1-1
dosbox 0.74.2-1
dosfstools 4.1-1
downgrade 6.0.0-2
dropbox-cli 2015.10.28-3
dwm 6.1-3
e2fsprogs 1.44.4-1
eclipse-java 4.9-1
emacs 26.1-2
espeak 1:1.48.04-1
fakeroot 1.23-1
feh 2.28-1
file 5.34-1
filesystem 2018.8-1
filezilla 3.37.4-1
findutils 4.6.0-2
firefox 62.0.3-1
gawk 4.2.1-1
gcc 8.2.1+20180831-1
gcc-fortran 8.2.1+20180831-1
gcc-libs 8.2.1+20180831-1
gcc7 7.3.1+20180814-1
gdb 8.2-2
gettext 0.19.8.1-2
gimp 2.10.6-2
git 2.19.1-1
glibc 2.28-4
glxinfo 8.4.0-1
gmrun 0.9.4w-1
google-chrome 68.0.3440.106-1
gparted 0.32.0-1
greenfoot 3.5.1-1
grep 3.1-1
groff 1.22.3-7
grub 2:2.02-7
grub-customizer 5.0.8-2
grub2-theme-archlinux 1.0-4
gvfs 1.38.1-1
gzip 1.9-1
htop 2.2.0-2
hwloc 1.11.10-1
inetutils 1.9.4-5
intellij-idea-ultimate-edition 2018.2.4-1
intellij-idea-ultimate-edition-jre 2018.2.4-1
iproute2 4.18.0-1
iputils 20180629.f6aac8d-2
irssi 1.1.1-2
jdk8-openjdk 8.u181-1
jmtpfs 0.5-1
keepass 2.40-1
keepass-plugin-keeagent 0.10.1-1
kpcli 3.2-2
la-capitaine-icon-theme-git r423.69803ebe-1
less 530-1
lesspipe 1.83-2
lftp 4.8.4-2
lib32-nvidia-utils 410.57-1
libreoffice-fresh 6.1.2-1
libtool 2.4.6+42+gb88cebd5-2
light 1.1.2-1
links 2.17-1
linux 4.18.12.arch1-1
logrotate 3.14.0-1
lshw B.02.18-2
lvm2 2.02.181-1
lxappearance 0.6.3-1
lxc 1:3.0.2-1
make 4.2.1-2
man-db 2.8.4-1
man-pages 4.16-2
mc 4.8.21-1
mdadm 4.0-1
mirage 0.9.5.2-5
mlocate 0.26.git.20170220-1
moreutils 0.62-1
mpd 0.20.21-1
mplayer 38101-2
mpv 1:0.29.1-2
mutt 1.10.1-4
namcap 3.2.8-2
ncmpcpp 0.8.2-4
net-tools 1.60.20180212git-1
netctl 1.18-1
nmap 7.70-2
ntfs-3g 2017.3.23-3
numix-gtk-theme 2.6.7-1
numix-themes-darkblue 2.6.7-2
nvidia 410.57-4
nvidia-settings 410.57-2
openbox 3.6.1-4
openssh 7.8p1-1
os-prober 1.76-1
p7zip 16.02-5
pacgraph 20110629-4
pacman 5.1.1-1
patch 2.7.6-3
pavucontrol 1:3.0+23+g335c26c-1
pciutils 3.6.1-1
pcmciautils 018-8
perl 5.28.0-1
perl-clipboard 0.13-4
phpstorm 2018.2.4-1
phpstorm-jre 2018.2.4-1
pkgconf 1.5.3-1
procps-ng 3.3.15-1
psmisc 23.2-1
pulseaudio 12.2-2
pulseaudio-alsa 2-4
pygmentize 2.2.0-2
python-pip 18.0-1
python-psycopg2 2.7.5-2
qalculate-gtk 2.6.2-1
ranger 1.9.1-3
redshift 1.12-2
reiserfsprogs 3.6.27-1
rstudio-desktop-git 1.2.679-1
rtorrent 0.9.7-1
rxvt-unicode-patched 9.22-10
samba 4.8.5-1
scrot 0.8.18-1
sed 4.5-1
shadow 4.6-1
slack-desktop 3.3.3-1
spotify 1.0.89.313-1
sshpass 1.06-1
steam 1.0.0.56-1
strace 4.24-1
strongswan 5.7.1-1
sublime-text 3176-1
sudo 1.8.25.p1-1
sysfsutils 2.1.0-10
systemd-sysvcompat 239.2-1
tar 1.30-1
texinfo 6.5-1
thunar 1.8.2-1
thunar-volman 0.8.1-2
thunderbird 60.0-4
tig 2.4.1-1
tint2 16.6.1-1
tk 8.6.8-3
tmux 2.7-1
tree 1.7.0-2
trizen-git 1.51-1
ttf-dejavu 2.37-2
ttf-liberation 2.00.1-7
tumbler 0.2.3-1
unrar 1:5.6.8-1
unzip 6.0-12
upower 0.99.8-2
urxvt-perls 2.2-2
usbutils 010-1
util-linux 2.32.1-2
vagrant 2.1.5-1
valgrind 3.13.0+290+2b0aa0a5-1
vifm 0.9.1-1
vim 8.1.0470-1
vim-clang-format-git 1-1
virtualbox 5.2.18-1
vlc 3.0.4-6
wget 1.19.5-1
which 2.21-2
wmctrl 1.07-5
wpa_supplicant 1:2.6-12
xclip 0.13-2
xdotool 3.20160805.1-1
xf86-input-synaptics 1.9.1-1
xf86-video-intel 1:2.99.917+847+g25c9a2fc-1
xf86-video-nouveau 1.0.15-3
xf86-video-vesa 2.4.0-2
xfsprogs 4.17.0-1
xorg-bdftopcf 1.1-1
xorg-docs 1.7.1-2
xorg-font-util 1.3.1-2
xorg-fonts-100dpi 1.0.3-3
xorg-fonts-75dpi 1.0.3-3
xorg-fonts-encodings 1.0.4-5
xorg-fonts-misc 1.0.3-5
xorg-iceauth 1.0.8-1
xorg-luit 1.1.1-3
xorg-mkfontdir 1.0.7-9
xorg-mkfontscale 1.1.3-1
xorg-server 1.20.1-1
xorg-server-common 1.20.1-1
xorg-server-devel 1.20.1-1
xorg-server-xdmx 1.20.1-1
xorg-server-xephyr 1.20.1-1
xorg-server-xnest 1.20.1-1
xorg-server-xvfb 1.20.1-1
xorg-server-xwayland 1.20.1-1
xorg-sessreg 1.1.1-1
xorg-setxkbmap 1.3.1-2
xorg-smproxy 1.0.6-2
xorg-x11perf 1.6.0-2
xorg-xbacklight 1.2.2-1
xorg-xcalc 1.0.6-2
xorg-xcmsdb 1.0.5-2
xorg-xcursorgen 1.0.6-2
xorg-xdriinfo 1.0.6-1
xorg-xev 1.2.2-2
xorg-xfontsel 1.0.6-1
xorg-xgamma 1.0.6-2
xorg-xhost 1.0.7-2
xorg-xinit 1.4.0-3
xorg-xinput 1.6.2-2
xorg-xkbcomp 1.4.2-1
xorg-xkbevd 1.1.4-2
xorg-xkbutils 1.0.4-3
xorg-xkill 1.0.5-1
xorg-xlsatoms 1.1.2-2
xorg-xlsclients 1.1.4-1
xorg-xpr 1.0.5-1
xorg-xrandr 1.5.0-1
xorg-xrefresh 1.0.6-1
xorg-xset 1.2.4-1
xorg-xsetroot 1.1.2-1
xorg-xvinfo 1.1.3-2
xorg-xwd 1.0.7-1
xorg-xwininfo 1.1.4-1
xorg-xwud 1.0.5-1
xscreensaver-arch-logo 5.40-1
xsel 1.2.0.20160929-1
xterm 337-1
yajl 2.1.0-2
yasm 1.3.0-2
youtube-dl 2018.10.05-1
zip 3.0-8
zsh 5.6.2-1


##########
2018-10-22
##########

ack 2.24-2
adobe-source-code-pro-fonts 2.030ro+1.050it-4
alsa-utils 1.1.7-1
alsi 0.4.7-1
android-tools 9.0.0_r3-1
arduino 1:1.8.7-1
audacity 2.3.0-1
bash 4.4.023-1
binutils 2.31.1-3
breeze-icons 5.51.0-1
bzip2 1.0.6-8
calibre 3.33.1-1
clion 1:2018.2.5-1
clion-cmake 1:2018.2.5-1
clion-gdb 1:2018.2.5-1
clion-jre 1:2018.2.5-1
clion-lldb 1:2018.2.5-1
cmake 3.12.3-1
cmatrix 1.2-1
conky 1.10.8-2
coreutils 8.30-1
cryptsetup 2.0.4-1
ctags 5.8-6
deluge 1.3.15+14+gb8e5ebe82-1
device-mapper 2.02.181-1
dhcpcd 7.0.8-1
dia 0.97.3-4
dialog 1:1.3_20180621-1
diffutils 3.6-1
dmidecode 3.2-1
docker 1:18.06.1-1
dosbox 0.74.2-1
dosfstools 4.1-1
downgrade 6.0.0-2
dropbox-cli 2015.10.28-3
dwm 6.1-3
e2fsprogs 1.44.4-1
eclipse-java 4.9-1
emacs 26.1-2
espeak 1:1.48.04-1
fakeroot 1.23-1
feh 2.28-1
file 5.34-1
filesystem 2018.8-1
filezilla 3.37.4-1
findutils 4.6.0-2
firefox 62.0.3-1
gawk 4.2.1-1
gcc 8.2.1+20180831-1
gcc-fortran 8.2.1+20180831-1
gcc-libs 8.2.1+20180831-1
gcc7 7.3.1+20180814-1
gdb 8.2-2
gettext 0.19.8.1-2
gimp 2.10.6-2
git 2.19.1-1
glibc 2.28-5
glxinfo 8.4.0-1
gmrun 0.9.4w-1
google-chrome 70.0.3538.67-1
gparted 0.32.0-1
grep 3.1-1
groff 1.22.3-7
grub 2:2.02-7
grub-customizer 5.1.0-1
grub2-theme-archlinux 1.0-4
gvfs 1.38.1-1
gzip 1.9-1
heimdall 1.4.2-1
htop 2.2.0-2
hwloc 1.11.10-1
inetutils 1.9.4-5
intellij-idea-ultimate-edition 2018.2.5-1
intellij-idea-ultimate-edition-jre 2018.2.5-1
iproute2 4.18.0-1
iputils 20180629.f6aac8d-2
irssi 1.1.1-2
jdk8-openjdk 8.u192-1
jmtpfs 0.5-2
keepass 2.40-1
keepass-plugin-keeagent 0.10.1-1
kpcli 3.2-2
la-capitaine-icon-theme-git r423.69803ebe-1
less 530-1
lesspipe 1.83-2
lftp 4.8.4-2
lib32-nvidia-utils 410.66-1
libreoffice-fresh 6.1.2-1
libtool 2.4.6+42+gb88cebd5-2
links 2.17-1
linux 4.18.16.arch1-1
logrotate 3.14.0-1
lshw B.02.18-2
lvm2 2.02.181-1
lxappearance 0.6.3-1
lxc 1:3.0.2-1
make 4.2.1-2
man-db 2.8.4-1
man-pages 4.16-2
mc 4.8.21-1
mdadm 4.0-1
mirage 0.9.5.2-5
mlocate 0.26.git.20170220-1
moreutils 0.62-1
mpd 0.20.21-1
mplayer 38101-2
mpv 1:0.29.1-2
mutt 1.10.1-4
namcap 3.2.8-2
ncmpcpp 0.8.2-4
net-tools 1.60.20180212git-1
netctl 1.18-1
nmap 7.70-2
ntfs-3g 2017.3.23-3
numix-gtk-theme 2.6.7-1
nvidia 410.66-3
nvidia-settings 410.66-1
openbox 3.6.1-4
openssh 7.9p1-1
os-prober 1.76-1
p7zip 16.02-5
pacgraph 20110629-4
pacman 5.1.1-1
patch 2.7.6-3
pavucontrol 1:3.0+23+g335c26c-1
pciutils 3.6.1-1
pcmciautils 018-8
perl 5.28.0-1
perl-clipboard 0.13-4
phpstorm 2018.2.5-1
phpstorm-jre 2018.2.5-1
pkgconf 1.5.3-1
procps-ng 3.3.15-1
psmisc 23.2-1
pulseaudio 12.2-2
pulseaudio-alsa 2-4
pygmentize 2.2.0-2
python-pip 18.0-1
python-psycopg2 2.7.5-2
qalculate-gtk 2.6.2-1
ranger 1.9.1-3
redshift 1.12-2
reiserfsprogs 3.6.27-1
rtorrent 0.9.7-1
rxvt-unicode-patched 9.22-10
samba 4.8.5-1
scrot 0.8.18-1
sed 4.5-1
shadow 4.6-1
slack-desktop 3.3.3-1
spotify 1.0.89.313-1
sshpass 1.06-1
steam 1.0.0.56-1
strace 4.24-1
strongswan 5.7.1-1
sublime-text 3176-1
sudo 1.8.25.p1-1
sysfsutils 2.1.0-10
systemd-sysvcompat 239.2-1
tar 1.30-1
texinfo 6.5-2
thunar 1.8.2-1
thunar-volman 0.8.1-2
thunderbird 60.2.1-1
tig 2.4.1-1
tint2 16.6.1-1
tk 8.6.8-3
tmux 2.8-1
tree 1.7.0-2
trizen-git 1.55.2.gfc27c0d-1
ttf-dejavu 2.37-2
ttf-liberation 2.00.1-7
tumbler 0.2.3-1
unrar 1:5.6.8-1
unzip 6.0-12
upower 0.99.8-2
urxvt-perls 2.2-2
usbutils 010-1
util-linux 2.32.1-2
vagrant 2.2.0-2
valgrind 3.13.0+290+2b0aa0a5-1
vifm 0.9.1-1
vim 8.1.0470-1
vim-clang-format-git 1-1
virtualbox 5.2.20-1
vlc 3.0.4-6
webstorm 2018.2.5-1
webstorm-jre 2018.2.5-1
wget 1.19.5-1
which 2.21-2
wmctrl 1.07-5
wpa_supplicant 1:2.6-12
xclip 0.13-2
xdotool 3.20160805.1-1
xf86-input-synaptics 1.9.1-1
xf86-video-intel 1:2.99.917+847+g25c9a2fc-1
xf86-video-nouveau 1.0.15-3
xf86-video-vesa 2.4.0-2
xfsprogs 4.18.0-1
xorg-bdftopcf 1.1-1
xorg-docs 1.7.1-2
xorg-font-util 1.3.1-2
xorg-fonts-100dpi 1.0.3-3
xorg-fonts-75dpi 1.0.3-3
xorg-fonts-encodings 1.0.4-5
xorg-fonts-misc 1.0.3-5
xorg-iceauth 1.0.8-1
xorg-luit 1.1.1-3
xorg-mkfontdir 1.0.7-9
xorg-mkfontscale 1.1.3-1
xorg-server 1.20.2-1
xorg-server-common 1.20.2-1
xorg-server-devel 1.20.2-1
xorg-server-xdmx 1.20.2-1
xorg-server-xephyr 1.20.2-1
xorg-server-xnest 1.20.2-1
xorg-server-xvfb 1.20.2-1
xorg-server-xwayland 1.20.2-1
xorg-sessreg 1.1.1-1
xorg-setxkbmap 1.3.1-2
xorg-smproxy 1.0.6-2
xorg-x11perf 1.6.0-2
xorg-xbacklight 1.2.2-1
xorg-xcalc 1.0.6-2
xorg-xcmsdb 1.0.5-2
xorg-xcursorgen 1.0.6-2
xorg-xdriinfo 1.0.6-1
xorg-xev 1.2.2-2
xorg-xfontsel 1.0.6-1
xorg-xgamma 1.0.6-2
xorg-xhost 1.0.7-2
xorg-xinit 1.4.0-3
xorg-xinput 1.6.2-2
xorg-xkbcomp 1.4.2-1
xorg-xkbevd 1.1.4-2
xorg-xkbutils 1.0.4-3
xorg-xkill 1.0.5-1
xorg-xlsatoms 1.1.2-2
xorg-xlsclients 1.1.4-1
xorg-xpr 1.0.5-1
xorg-xrandr 1.5.0-1
xorg-xrefresh 1.0.6-1
xorg-xset 1.2.4-1
xorg-xsetroot 1.1.2-1
xorg-xvinfo 1.1.3-2
xorg-xwd 1.0.7-1
xorg-xwininfo 1.1.4-1
xorg-xwud 1.0.5-1
xscreensaver-arch-logo 5.40-1
xsel 1.2.0.20160929-1
xterm 337-1
yajl 2.1.0-2
yasm 1.3.0-2
youtube-dl 2018.10.05-1
zip 3.0-8
zsh 5.6.2-1


##########
2018-10-28
##########
ack 2.24-2
adobe-source-code-pro-fonts 2.030ro+1.050it-4
alsa-utils 1.1.7-1
alsi 0.4.7-1
android-tools 9.0.0_r3-1
arduino 1:1.8.7-1
audacity 2.3.0-1
autoconf 2.69-4
automake 1.16.1-1
bash 4.4.023-1
binutils 2.31.1-3
bison 3.1-1
breeze-icons 5.51.0-1
bzip2 1.0.6-8
calibre 3.33.1-1
clion 1:2018.2.5-1
clion-cmake 1:2018.2.5-1
clion-gdb 1:2018.2.5-1
clion-jre 1:2018.2.5-1
clion-lldb 1:2018.2.5-1
cmake 3.12.3-1
cmatrix 1.2-1
conky 1.10.8-2
coreutils 8.30-1
cryptsetup 2.0.4-1
ctags 5.8-6
deluge 1.3.15+14+gb8e5ebe82-1
device-mapper 2.02.181-1
dhcpcd 7.0.8-1
dia 0.97.3-4
dialog 1:1.3_20180621-1
diffutils 3.6-1
dmidecode 3.2-1
docker 1:18.06.1-1
dosbox 0.74.2-1
dosfstools 4.1-1
downgrade 6.0.0-2
dropbox-cli 2015.10.28-3
dwm 6.1-3
e2fsprogs 1.44.4-1
eclipse-java 4.9-1
emacs 26.1-2
espeak 1:1.48.04-1
fakeroot 1.23-1
feh 2.28-1
file 5.35-1
filesystem 2018.8-1
filezilla 3.38.1-1
findutils 4.6.0-2
firefox 63.0-1
flex 2.6.4-1
gawk 4.2.1-1
gcc 8.2.1+20180831-1
gcc-fortran 8.2.1+20180831-1
gcc-libs 8.2.1+20180831-1
gcc7 7.3.1+20180814-1
gdb 8.2-2
gettext 0.19.8.1-2
gimp 2.10.6-2
git 2.19.1-1
glibc 2.28-5
glxinfo 8.4.0-1
gmrun 0.9.4w-1
google-chrome 70.0.3538.77-1
gparted 0.32.0-1
grep 3.1-1
groff 1.22.3-7
grub 2:2.02-7
grub-customizer 5.1.0-1
grub2-theme-archlinux 1.0-4
gvfs 1.38.1-1
gzip 1.9-1
heimdall 1.4.2-1
htop 2.2.0-2
hwloc 1.11.11-1
inetutils 1.9.4-5
intellij-idea-ultimate-edition 2018.2.5-1
intellij-idea-ultimate-edition-jre 2018.2.5-1
iproute2 4.19.0-1
iputils 20180629.f6aac8d-2
irssi 1.1.1-2
jdk8-openjdk 8.u192-1
jmtpfs 0.5-2
keepass 2.40-1
keepass-plugin-keeagent 0.10.1-1
kpcli 3.2-2
la-capitaine-icon-theme-git r423.69803ebe-1
less 530-1
lesspipe 1.83-2
lftp 4.8.4-2
lib32-nvidia-utils 410.66-1
libreoffice-fresh 6.1.2-1
libtool 2.4.6+42+gb88cebd5-2
light 1.2-1
links 2.17-1
linux 4.18.16.arch1-1
logrotate 3.14.0-1
lshw B.02.18-2
lvm2 2.02.181-1
lxappearance 0.6.3-1
lxc 1:3.0.2-1
m4 1.4.18-1
make 4.2.1-2
man-db 2.8.4-1
man-pages 4.16-2
mc 4.8.21-1
mdadm 4.0-1
mirage 0.9.5.2-5
mlocate 0.26.git.20170220-1
moreutils 0.62-1
mpd 0.20.21-1
mplayer 38101-2
mpv 1:0.29.1-2
mutt 1.10.1-5
namcap 3.2.8-3
nano 3.1-1
ncmpcpp 0.8.2-4
net-tools 1.60.20180212git-1
netctl 1.18-1
nmap 7.70-2
ntfs-3g 2017.3.23-3
numix-gtk-theme 2.6.7-1
nvidia 410.66-3
nvidia-settings 410.66-1
obs-studio 22.0.2-1
openbox 3.6.1-4
openssh 7.9p1-1
os-prober 1.76-1
p7zip 16.02-5
pacgraph 20110629-4
pacman 5.1.1-1
patch 2.7.6-3
pavucontrol 1:3.0+23+g335c26c-1
pciutils 3.6.1-1
perl 5.28.0-1
perl-clipboard 0.13-4
phpstorm 2018.2.5-1
phpstorm-jre 2018.2.5-1
pkgconf 1.5.3-1
procps-ng 3.3.15-1
psmisc 23.2-1
pulseaudio 12.2-2
pulseaudio-alsa 2-4
pygmentize 2.2.0-2
python-pip 18.0-1
python-psycopg2 2.7.5-2
qalculate-gtk 2.6.2-1
ranger 1.9.1-3
redshift 1.12-2
reiserfsprogs 3.6.27-1
rtorrent 0.9.7-1
rxvt-unicode-patched 9.22-10
samba 4.8.5-1
scrot 0.8.18-1
sed 4.5-1
shadow 4.6-1
slack-desktop 3.3.3-1
spotify 1.0.92.390-1
sshpass 1.06-1
steam 1.0.0.56-1
strace 4.24-1
strongswan 5.7.1-1
sublime-text 3176-1
sudo 1.8.25.p1-1
sysfsutils 2.1.0-10
systemd-sysvcompat 239.2-1
tar 1.30-1
terminator 1.91-6
texinfo 6.5-2
thunar 1.8.2-1
thunar-volman 0.8.1-2
thunderbird 60.2.1-1
tig 2.4.1-1
tint2 16.6.1-1
tk 8.6.8-3
tmux 2.8-1
tree 1.7.0-2
trizen-git 1.55.2.gfc27c0d-1
ttf-dejavu 2.37-2
ttf-liberation 2.00.1-7
tumbler 0.2.3-1
unrar 1:5.6.8-1
unzip 6.0-12
upower 0.99.9-1
urxvt-perls 2.2-2
usbutils 010-1
util-linux 2.32.1-2
vagrant 2.2.0-2
valgrind 3.14.0-1
vifm 0.9.1-1
vim 8.1.0470-1
vim-clang-format-git 1-1
virtualbox 5.2.20-1
vlc 3.0.4-6
webstorm 2018.2.5-1
webstorm-jre 2018.2.5-1
wget 1.19.5-1
which 2.21-2
wmctrl 1.07-5
wpa_supplicant 1:2.6-12
xclip 0.13-2
xdotool 3.20160805.1-1
xf86-input-synaptics 1.9.1-1
xf86-video-intel 1:2.99.917+853+g0932a6b3-1
xf86-video-nouveau 1.0.15-3
xf86-video-vesa 2.4.0-2
xfsprogs 4.18.0-1
xorg-bdftopcf 1.1-1
xorg-docs 1.7.1-2
xorg-font-util 1.3.1-2
xorg-fonts-100dpi 1.0.3-3
xorg-fonts-75dpi 1.0.3-3
xorg-fonts-encodings 1.0.4-5
xorg-fonts-misc 1.0.3-5
xorg-iceauth 1.0.8-1
xorg-luit 1.1.1-3
xorg-mkfontdir 1.0.7-9
xorg-mkfontscale 1.1.3-1
xorg-server 1.20.3-1
xorg-server-common 1.20.3-1
xorg-server-devel 1.20.3-1
xorg-server-xdmx 1.20.3-1
xorg-server-xephyr 1.20.3-1
xorg-server-xnest 1.20.3-1
xorg-server-xvfb 1.20.3-1
xorg-server-xwayland 1.20.3-1
xorg-sessreg 1.1.1-1
xorg-setxkbmap 1.3.1-2
xorg-smproxy 1.0.6-2
xorg-x11perf 1.6.0-2
xorg-xbacklight 1.2.2-1
xorg-xcalc 1.0.6-2
xorg-xcmsdb 1.0.5-2
xorg-xcursorgen 1.0.6-2
xorg-xdriinfo 1.0.6-1
xorg-xev 1.2.2-2
xorg-xfontsel 1.0.6-1
xorg-xgamma 1.0.6-2
xorg-xhost 1.0.7-2
xorg-xinit 1.4.0-3
xorg-xinput 1.6.2-2
xorg-xkbcomp 1.4.2-1
xorg-xkbevd 1.1.4-2
xorg-xkbutils 1.0.4-3
xorg-xkill 1.0.5-1
xorg-xlsatoms 1.1.2-2
xorg-xlsclients 1.1.4-1
xorg-xpr 1.0.5-1
xorg-xrandr 1.5.0-1
xorg-xrefresh 1.0.6-1
xorg-xset 1.2.4-1
xorg-xsetroot 1.1.2-1
xorg-xvinfo 1.1.3-2
xorg-xwd 1.0.7-1
xorg-xwininfo 1.1.4-1
xorg-xwud 1.0.5-1
xscreensaver-arch-logo 5.40-1
xsel 1.2.0.20160929-1
xterm 337-1
yajl 2.1.0-2
yasm 1.3.0-2
youtube-dl 2018.10.05-1
zip 3.0-8
zsh 5.6.2-1
