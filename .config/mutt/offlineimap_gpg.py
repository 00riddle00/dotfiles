#!/usr/bin/env python3
# vim: set ft=python tw=88 nu ai et ts=4 sw=4:
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-08-11 19:23:20 CEST
# Path:   ~/.config/mutt/offlineimap_gpg.py
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
import os
from subprocess import check_output


def get_pass(account):
    config_home = os.environ.get("XDG_CONFIG_HOME", os.path.expanduser("~/.config"))
    cmd = f"gpg -dq {config_home}/mutt/.mail_passwd_{account}.gpg"
    return check_output(cmd, shell=True, text=True).strip("\n")
