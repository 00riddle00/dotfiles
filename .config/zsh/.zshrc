
# Enable colors 
autoload -U colors && colors

# prompt
PS1="┌─[%{$fg[cyan]%}%m%{$fg_bold[blue]%} %~%{$fg_no_bold[yellow]%}%(0?..
%?)%{$reset_color%}]
└─╼ "

# completions
autoload -Uz compinit
zmodload zsh/complist
compinit

zstyle ':completion:*' completer _complete _correct _approximate
zstyle ':completion:*' expand prefix suffix
zstyle ':completion:*' completer _expand_alias _complete _approximate
zstyle ':completion:*' menu select
zstyle ':completion:*' file-sort name
zstyle ':completion:*' ignore-parents pwd
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'

# navigation
setopt AUTO_CD

# history options
export HISTFILE="$ZDOTDIR/histfile"
export HISTSIZE=10000
export SAVEHIST=$((HISTSIZE/2))
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_SAVE_NO_DUPS
setopt HIST_VERIFY
setopt INC_APPEND_HISTORY
setopt EXTENDED_HISTORY

# keybinds
## vi mode
bindkey -v
KEYTIMEOUT=1

## use the vi navigation keys in menu completion
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history

## history
bindkey '^R' history-incremental-search-backward

# colors for ls
if [ -f $DIRCOLORS ]; then
    eval $(dircolors $DIRCOLORS)
fi

# source highlighting
source "$ZDOTDIR"/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern)

# aliases and functions
if [[ -d "$ZDOTDIR" ]]; then
  for file in "$ZDOTDIR"/*.zsh; do
    source "$file"
  done
fi

# execute commands 
## avoid Ctrl-s freezing the terminal
stty -ixon

## system information tool for Arch Linux
neofetch

## random delimiter to know that the shell has been reloaded
# echo "  [========]"

## launch tmux
tmux > /dev/null 2>&1

## conda initialize
# source $ZSH_DIR/conda_env.sh

# broot
source $HOME/.config/broot/launcher/bash/br

# prevent Ctrl+d from exiting the shell
set -o ignoreeof 
