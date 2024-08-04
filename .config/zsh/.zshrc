#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-08-04 23:55:21 EEST
# Path:   ~/.config/zsh/.zshrc
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

# -------------------------------------------
# Colors and prompt
# -------------------------------------------

# Enable and initialize color support
autoload -U colors && colors

# Prompt
if [[ $HOST =~ "^(panther|tulkun)$" ]]; then
  host_color="cyan"
else
  host_color="red"
fi

PS1="┌─[%{$fg[$host_color]%}%m%{$fg_bold[blue]%} %~%{$fg_no_bold[yellow]%}%(0?..
%?)%{$reset_color%}]
└─╼ "

# Set up directory colors in the terminal
if [[ -f $DIRCOLORS ]]; then
  eval $(dircolors $DIRCOLORS)
fi

# Use zsh-fast-syntax-highlighting package / plugin
source \
  /usr/share/zsh/plugins/fast-syntax-highlighting/\
fast-syntax-highlighting.plugin.zsh

# Configure the highlighters
ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern)

# -------------------------------------------
# Completions
# -------------------------------------------

# Enable completion system
autoload -Uz compinit
# Load a specific Zsh module that enhances the completion system
zmodload zsh/complist
# Initialize the completion system
compinit

# Configure various aspects of the Zsh completion system
zstyle ':completion:*' completer _complete _correct _approximate
zstyle ':completion:*' expand prefix suffix
zstyle ':completion:*' completer _expand_alias _complete _approximate
zstyle ':completion:*' menu select
zstyle ':completion:*' file-sort name
zstyle ':completion:*' ignore-parents pwd
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'

# -------------------------------------------
# History
# -------------------------------------------

# HISTFILE, HISTSIZE, SAVEHIST variables are set in .zshenv
# Remove all duplicate entries from the history file
setopt HIST_IGNORE_ALL_DUPS
# Remove duplicate entries before older entries when the
# history file reaches its maximum size.
setopt HIST_EXPIRE_DUPS_FIRST
# Prevent duplicate commands from being saved to the history file
setopt HIST_SAVE_NO_DUPS
# Do not execute immediately a command retrieved from history
setopt HIST_VERIFY
# Append each command to the history file as soon as it is executed
setopt INC_APPEND_HISTORY
# Save additional information in the history file, such as the
# timestamp for each command.
setopt EXTENDED_HISTORY

# -------------------------------------------
# Keybindings
# -------------------------------------------

# History
bindkey '^R' history-incremental-search-backward
bindkey '^O' history-incremental-search-forward

# Manual pages for current command
bindkey "^[h" run-help

# vi mode
bindkey -v
# Make the shell wait for 0.01 seconds for the next key in a sequence
# before it times out and considers the input complete
KEYTIMEOUT=1

# Enable a function for editing the current command line in an external editor
autoload -Uz edit-command-line
# Create a new Zsh Line Editor (ZLE) widget or to redefine an existing one
zle -N edit-command-line
# 'v' (lowercase) in visual mode opens VIM to edit the command.
# :wq brings back the edited command in the zsh prompt (before that, it
#   can be useful to call :w {filename} and save the command to a file).
# 'V' (uppercase) just performs the selection as usual.
bindkey -M vicmd v edit-command-line

# Use vi navigation keys in menu completion
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history

# Emacs keybindings (suitable for vi mode)
bindkey '^f'  forward-char
bindkey '^b'  backward-char
bindkey '^[f' forward-word
bindkey '^[b' backward-word
bindkey '^e'  end-of-line
bindkey '^a'  beginning-of-line

#bindkey '^p'  up-line
#bindkey '^n'  down-line
bindkey '^p'  up-history
bindkey '^n'  down-history

bindkey '^d'  delete-char-or-list
#bindkey '^h'  backward-delete-char
# ^-- <C-h> is used by vim-tmux-navigator, instead use <BS>
bindkey '^[d' kill-word
bindkey '^w'  backward-kill-word
#bindkey '^k'  kill-line
# ^-- <C-k> is used by vim-tmux-navigator, instead use <M-d> multiple times
bindkey '^u'  backward-kill-line
bindkey '^g'  kill-whole-line

bindkey '^y'  yank

#bindkey '^t'  transpose-chars
# ^-- <C-t> is used by fzf
bindkey '^[t' transpose-words

bindkey '^[u' up-case-word
bindkey '^[l' down-case-word
bindkey '^[c' capitalize-word
# ^-- <A-c> is used by fzf

# ^_ means <C-/>
bindkey '^_'  undo

# -------------------------------------------
# Misc
# -------------------------------------------

# Navigate to a directory by just typing its name
setopt AUTO_CD

# Prevent <C-d> from exiting the shell
set -o ignoreeof

# Disable audible notifications
unsetopt BEEP

# Software flow control bytes:
#   XOFF (ASCII 0x13, DC3, sent with <C-s> key) - pause transmission
#   XON  (ASCII 0x11, DC1, sent with <C-q> key) - resume transmission
# OS's terminal driver is responsible for this
#
# Disable XON/XOFF flow control
stty -ixon

# Use autojump package / plugin
if [[ -s /etc/profile.d/autojump.sh ]]; then
  source /etc/profile.d/autojump.sh
fi

# Use the key bindings of the fzf package / plugin
if [[ -x "$(command -v fzf)"  ]]; then
  source /usr/share/fzf/key-bindings.zsh
fi

# A fix to make PyCharm auto-activate Python virtual
# environment upon opening a new terminal tab.
# See https://youtrack.jetbrains.com/issue/PY-61593/Activate-virtualenv-terminal-option-does-not-work-after-installing-oh-my-zsh
if [ -n "$JEDITERM_SOURCE" ]; then
  source $(echo $JEDITERM_SOURCE)
  unset JEDITERM_SOURCE
fi

# Organize Zsh configuration across multiple files
# (mainly for aliases and functions)
if [[ -d "$ZDOTDIR" ]]; then
  for file in "$ZDOTDIR"/*.zsh; do
    source "$file"
  done
fi

# -------------------------------------------
# Launch programs
# -------------------------------------------

# Launch system information tool
#archey
#neofetch

# Launch tmux
tmux > /dev/null 2>&1
true
