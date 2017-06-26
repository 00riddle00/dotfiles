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
