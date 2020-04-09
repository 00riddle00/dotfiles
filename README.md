## dotfiles

#### Openbox 
![openbox_preview](https://github.com/00riddle00/dotfiles/raw/master/preview_openbox.png) 

#### i3
![i3_preview](https://github.com/00riddle00/dotfiles/raw/master/preview_i3.png) 

- Scripts are in  `bin/` and `.local/bin/`
- Adhering to XDG Base Directory specification:
	- All configs that can be in `~/.config/` are being moved there (in progress).
	- Some environmental variables have been set in `~/.zshenv` to move configs into `~/.config/`
- Separate repos for suckless:
	- [dwm](https://github.com/00riddle00/dwm)
	- [dmenu](https://github.com/00riddle00/dmenu)

### Window managers
- Openbox
- i3-gaps
- dwm
- Xmonad

### Applications
- bat
- broot
- calcurse
- cmus
- irssi
- ncmpcpp
- neomutt
- newsboat
- notmuch
- qutebrowser
- ranger
- rofi
- rtorrent
- sc-im
- sxiv
- tig
- tmux
- tmuxinator
- vim
- zathura
- zsh
- and others....

### Look and Feel

#### Themes
* la-capitaine-icon-theme
* numix-cursor-theme
* numix-themes-archblue

#### Fonts
- [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)
- [Noto fonts](https://github.com/googlefonts/noto-fonts)
- [Nerd fonts](https://github.com/ryanoasis/nerd-fonts)

## Install

Deployment scripts are reserved for the bright future.

(just for myself so far):
#### Prerequisites
* Arch installed with `base` and `base-devel`
* [list of programs](https://github.com/00riddle00/dotfiles/blob/master/progs.csv)
```bash
git clone https://github.com/00riddle00/dotfiles $HOME/.dotfiles
$HOME/.dotfiles/bin/manage_dotfiles/symlink_dotfiles.sh
$HOME/.dotfiles/bin/manage_dotfiles/install_vim_plugins.sh
```

## Gratitude
The usual suspects are
* Luke Smith: [https://lukesmith.xyz/](https://lukesmith.xyz/), [GitHub](https://github.com/LukeSmithxyz)
* Derek Taylor @DistroTube: [https://distrotube.com/](https://distrotube.com/), [GitLab](https://gitlab.com/dwt1)

As well as:
* Jason Ryan: [http://jasonwryan.com/](http://jasonwryan.com/), [sourcehut](https://hg.sr.ht/~jasonwryan) -> best colors in terminal apps
* Andrea Denisse: [https://github.com/da-edra](https://github.com/da-edra) -> beautiful i3blocks
* Micah Halter: [https://www.mehalter.com/](https://www.mehalter.com/), [Git](https://git.mehalter.com/mehalter) -> many things
