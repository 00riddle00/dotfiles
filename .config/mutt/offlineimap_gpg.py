#!/usr/bin/env python3
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-10 22:52:33 CEST
# Path:   ~/.config/mutt/offlineimap_gpg.py
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
import os
from subprocess import check_output


def get_pass(account):
    config_home = os.environ.get("XDG_CONFIG_HOME", os.path.expanduser("~/.config"))
    cmd = f"gpg -dq {config_home}/mutt/.mail_passwd_{account}.gpg"
    return check_output(cmd, shell=True, text=True).strip("\n")
