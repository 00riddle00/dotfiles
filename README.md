#### Important note
`.zshenv` was moved to [`$XDG_CONFIG_HOME/zsh/.zshenv`](.config/zsh/.zshenv)
To allow for this, wider system configuration needs to set the `ZDOTDIR` enviroment
variable beforehand. This can be done in e.g. `/etc/zsh/zshenv`:
```bash
export ZDOTDIR=$HOME/.config/zsh
```
See [this](https://www.zsh.org/mla/workers/2013/msg00692.html) mailing list and,
for general info, see [this](https://wiki.archlinux.org/title/XDG_Base_Directory) wiki page.

#### Openbox
![openbox_preview](https://i.imgur.com/plt4Ygj.png)

#### i3
![i3_preview](https://i.imgur.com/64izSk1.png)

- Separate repos for suckless (I actually only use dmenu).
  - [dwm](https://github.com/00riddle00/dwm)
  - [dwmblocks](https://github.com/00riddle00/dwmblocks)
  - [dmenu](https://github.com/00riddle00/dmenu)
  - [st](https://github.com/00riddle00/st)
- Wallpapers [repo](https://github.com/00riddle00/wallpapers)

### Window managers (depending on the mood)
- Openbox
- i3-gaps

### Applications
- bat
- calcurse
- cmus
- irssi
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

#### Prerequisites
* Arch installed with `base` and `base-devel`

Deployment scripts are being crafted:
[NPbuild](https://github.com/00riddle00/NPbuild)

## Gratitude
The usual suspects are
* Luke Smith: [https://lukesmith.xyz/](https://lukesmith.xyz/), [GitHub](https://github.com/LukeSmithxyz)
* Derek Taylor @DistroTube: [https://distrotube.com/](https://distrotube.com/), [GitLab](https://gitlab.com/dwt1)

As well as:
* Jason Ryan: [https://jasonwryan.com/](https://jasonwryan.com/), [sourcehut](https://hg.sr.ht/~jasonwryan) -> best colors in terminal apps
* Andrea Denisse: [https://github.com/da-edra](https://github.com/da-edra) -> beautiful i3blocks and neofetch pacman image
* Micah Halter: [https://www.mehalter.com/](https://www.mehalter.com/), [Git](https://git.mehalter.com/mehalter) -> many things
