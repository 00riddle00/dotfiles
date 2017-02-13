
# Turn off Touchpad 
# synclient TouchpadOff=1

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

export TERM=terminator

if [ $USER == "root" ]; then 
    color="31m"
else
    color="32m"
fi

export PS1="\[\e[1;$color\][\u@\W]\[\e[1;36m\][$HOSTNAME]$\[\033[0m\] "

#if [ command -v setxkbmap >/dev/null 2>&1 ]; then 
setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt
setxkbmap -option caps:escape
    #setxkbmap -option grp:setxkbmap -option grp:alt_shift_toggle us,lt,il
#fi

#archey && fortune | cowsay
screenfetch
#archey
#quote=$(fortune) && cowsay $quote && espeak "$quote" &> /dev/null 

if [ -f $HOME/.dircolors ]; then
    eval $(dircolors ~/.dircolors)
fi

# Vi everything
set -o vi

. ~/.aliases
