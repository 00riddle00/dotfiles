#------------------------------------------------------------------------------
# User: 00riddle00 (Tomas Giedraitis)
# Date: 2024-07-29 11:10:36 EEST
# Path: ~/.config/zsh/zsh-vi-search.zsh
# URL:  https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
# Author: Soheil Rashidi (https://github.com/soheilpro)
# Orig. URL: https://raw.githubusercontent.com/soheilpro/zsh-vi-search/187973653275062c77379dd9078f235ced3733ad/src/zsh-vi-search.zsh
# Orig. URL/File Retrieval: 2024-03-17 22:41:58 EET
#------------------------------------------------------------------------------

autoload -U read-from-minibuffer

function _index-of {
  setopt localoptions no_sh_word_split
  local STR=$1
  local STRLEN=${#STR}
  local SUBSTR=$2
  local SUBSTRLEN=${#SUBSTR}
  local START=${3:-0}
  local DIRECTION=${4:-1}

  [[ $STRLEN -ge 0 ]]      || return 1
  [[ $SUBSTRLEN -ge 0 ]]   || return 2
  [[ $START -ge 0 ]]       || return 3
  [[ $START -lt $STRLEN ]] || return 4
  [[ $DIRECTION -eq 1 || $DIRECTION -eq -1 ]] || return 5

  for ((INDEX = $START; INDEX >= 0 && INDEX < $STRLEN; INDEX = INDEX + $DIRECTION)); do
    if [[ "${STR:$INDEX:$SUBSTRLEN}" == "$SUBSTR" ]]; then
      echo $INDEX
      return
    fi
  done

  return -1
}

function _vi-search-forward {
  setopt localoptions no_sh_word_split
  read-from-minibuffer
  INDEX=$(_index-of $BUFFER $REPLY $(($CURSOR + 1))) && CURSOR=$INDEX || INDEX=$(_index-of $BUFFER $REPLY 0) && CURSOR=$INDEX
  export VISEARCHSTR=$REPLY
  export VISEARCHDIRECTION=1
}

function _vi-search-forward-repeat {
  setopt localoptions no_sh_word_split
  INDEX=$(_index-of $BUFFER $VISEARCHSTR $(($CURSOR + 1))) && CURSOR=$INDEX || INDEX=$(_index-of $BUFFER $VISEARCHSTR 0) && CURSOR=$INDEX
}

function _vi-search-backward {
  setopt localoptions no_sh_word_split
  read-from-minibuffer
  INDEX=$(_index-of $BUFFER $REPLY $(($CURSOR - 1)) -1) && CURSOR=$INDEX || INDEX=$(_index-of $BUFFER $REPLY $((${#BUFFER} - 1)) -1) && CURSOR=$INDEX
  export VISEARCHSTR=$REPLY
  export VISEARCHDIRECTION=-1
}

function _vi-search-backward-repeat {
  setopt localoptions no_sh_word_split
  INDEX=$(_index-of $BUFFER $VISEARCHSTR $(($CURSOR - 1)) -1) && CURSOR=$INDEX || INDEX=$(_index-of $BUFFER $VISEARCHSTR $((${#BUFFER} - 1)) -1) && CURSOR=$INDEX
}

function _vi-search-repeat {
  setopt localoptions no_sh_word_split
  if [[ $VISEARCHDIRECTION -eq 1 ]]; then
    _vi-search-forward-repeat
  else
    _vi-search-backward-repeat
  fi
}

function _vi-search-repeat-reverse {
  setopt localoptions no_sh_word_split
  if [[ $VISEARCHDIRECTION -eq 1 ]]; then
    _vi-search-backward-repeat
  else
    _vi-search-forward-repeat
  fi
}

zle -N vi-search-backward       _vi-search-backward
zle -N vi-search-forward        _vi-search-forward
zle -N vi-search-repeat         _vi-search-repeat
zle -N vi-search-repeat-reverse _vi-search-repeat-reverse

bindkey -M vicmd '?' vi-search-backward
bindkey -M vicmd '/' vi-search-forward
bindkey -M vicmd 'n' vi-search-repeat
bindkey -M vicmd 'N' vi-search-repeat-reverse
