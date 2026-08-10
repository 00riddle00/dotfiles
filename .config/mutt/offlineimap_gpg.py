#! /usr/bin/env python2
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-10 06:13:41 CEST
# Path:   ~/.config/mutt/offlineimap_gpg.py
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

from subprocess import check_output

def get_pass(account):
    return check_output("gpg -dq ${XDG_CONFIG_HOME}/mutt/.mail_passwd_{}.gpg".format(account) , shell=True).strip("\n")
