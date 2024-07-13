#! /usr/bin/env python2
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2020-03-28 23:07:40 EET
# Path:   ~/.config/mutt/offlineimap_gpg.py
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

from subprocess import check_output

def get_pass(account):
    return check_output('gpg -dq $XDG_CONFIG_HOME/mutt/.mail_passwd_{}.gpg'.format(account) , shell=True).strip('\n')
