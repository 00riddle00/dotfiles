. $HOME/.aliases


if [ $USER == "root" ]; then 
    color="31m"
else
    color="32m"
fi

export PS1="\[\e[1;$color\][\u@\W]\[\e[1;36m\][$HOSTNAME]$\[\033[0m\] "

alias con=''
