#! /usr/bin/env python2
from subprocess import check_output

def get_pass(account):
    return check_output('gpg -dq $XDG_CONFIG_HOME/mutt/.mail_passwd_{}.gpg'.format(account) , shell=True).strip('\n')
