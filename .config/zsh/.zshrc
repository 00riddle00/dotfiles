# Enable colors 
autoload -U colors && colors

# prompt
host_color="cyan"
[[ ! $HOST =~ "^(gecko|panther|tulkun)$" ]] && host_color="red";

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
export HISTSIZE=400000
export SAVEHIST=$((HISTSIZE/2))
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_SAVE_NO_DUPS
setopt HIST_VERIFY
setopt INC_APPEND_HISTORY
setopt EXTENDED_HISTORY

# keybinds

## mode (-v: vim, -e: emacs)
bindkey -v
KEYTIMEOUT=1

### 'v' (lowercase) in visual mode opens VIM to edit the command.
### :wq brings back the edited command in the zsh prompt (before 
### that, it can be useful to call :w {filename} and save the 
### command to a file).
### P.S. 'V' (uppercase) just performs the selection as usual.
autoload -Uz edit-command-line
zle -N edit-command-line
bindkey -M vicmd v edit-command-line

### use the vi navigation keys in menu completion
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history

## emacs keybindings
bindkey '^f'   forward-char
bindkey '^b'   backward-char
bindkey '^[f'  forward-word
bindkey '^[b'  backward-word
bindkey '^e'   end-of-line
bindkey '^a'   beginning-of-line

#bindkey '^p'   up-line
#bindkey '^n'   down-line
bindkey '^p'   up-history
bindkey '^n'   down-history

bindkey '^d'   delete-char-or-list
bindkey '^?'   backward-delete-char
#              (<C-h> is already taken by tmux).
bindkey '^[d'  kill-word
bindkey '^w'   backward-kill-word 
bindkey '^[^?' backward-kill-word 
# none         kill-line
#              (<C-k> is already taken by tmux, 
#              use <M-d> multiple times).
bindkey '^u'   backward-kill-line
bindkey '^g'   kill-whole-line 

bindkey '^y'   yank

#bindkey '^t'   transpose-chars
bindkey '^[t'  transpose-words

bindkey '^[u'  up-case-word
bindkey '^[l'  down-case-word
bindkey '^[c'  capitalize-word

bindkey '^_'   undo # <C-/>

## history
bindkey '^R'   history-incremental-search-backward
bindkey '^O'   history-incremental-search-forward

# colors for ls
if [ -f $DIRCOLORS ]; then
    eval $(dircolors $DIRCOLORS)
fi

# source highlighting
source /usr/share/zsh/plugins/fast-syntax-highlighting/fast-syntax-highlighting.plugin.zsh
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

## system information tool (configured for Arch Linux)
## to use the original neofetch, delete $XDG_CONFIG_HOME/neofetch/
#neofetch
#archey

## launch tmux
tmux > /dev/null 2>&1

## conda initialize
#source $ZDOTDIR/conda_env.sh

## 'set' - shell builtin that control various 
##   shell options and positional parameters 
##   (regarded as a special builtin by the POSIX standard)
set -o ignoreeof ## prevents Ctrl+d from exiting the shell

unsetopt BEEP

[[ -s /etc/profile.d/autojump.sh ]] && source /etc/profile.d/autojump.sh

if [ -x "$(command -v fzf)"  ]
then
    source /usr/share/fzf/key-bindings.zsh
fi

if [ -f ~/.fzf.zsh ]
then
    source ~/.fzf.zsh
fi
