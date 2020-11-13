
# Enable colors 
autoload -U colors && colors

# prompt
host_color="cyan"
[[ $HOST != "riddle" ]] && host_color="red";

PS1="┌─[%{$fg[$host_color]%}%m%{$fg_bold[blue]%} %~%{$fg_no_bold[yellow]%}%(0?..
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

## 'setopt' modifies shell optional behavior.
##   (is not regarded as a special builtin by the POSIX standard)
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

### 'v' in visual mode opens VIM to edit the command in a full editor.
autoload -U edit-command-line
zle -N edit-command-line
bindkey -M vicmd v edit-command-line

### use the vi navigation keys in menu completion
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history

## emacs-like keybindings
bindkey '^f'  forward-char
bindkey '^b'  backward-char
bindkey '^[f' forward-word
bindkey '^[b' backward-word
bindkey '^e'  vi-end-of-line
bindkey '^a'  vi-beginning-of-line

bindkey '^d'  delete-char-or-list
# <DEL> (ie. backspace) - backward-delete-char
bindkey '^[d'  delete-word
# <C-W> backward-delete-word (vim's key)
# none  - delete to the end of line (<C-k> is already taken)
# <C-u> - delete to start of line (vim's key)

bindkey '^p'  history-beginning-search-backward
bindkey '^n'  history-beginning-search-forward

bindkey '^y'  yank
bindkey '^g' kill-whole-line 

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

## software flow control bytes:
##   XOFF (ASCII 0x13, DC3, sent with Ctrl-S) - pause transmission
##   XON  (ASCII 0x11, DC1, sent with Ctrl-Q) - resume transmission
## OS's terminal driver is responsible for this
stty -ixon ## disables XON/XOFF flow control

## system information tool for Arch Linux
#neofetch

## launch tmux
tmux > /dev/null 2>&1

## conda initialize
#source $ZSH_DIR/conda_env.sh

## 'set' - shell builtin that control various 
##   shell options and positional parameters 
##   (regarded as a special builtin by the POSIX standard)
set -o ignoreeof ## prevents Ctrl+d from exiting the shell
