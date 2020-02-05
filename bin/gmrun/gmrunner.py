#!/usr/bin/env python3

from collections import OrderedDict
import os
import sys

GMRUN_BIN = '/usr/bin/gmrun'
GMRUN_HIST = '~/.gmrun_history'
CMD = 'wmctrl -a'

def main():
  histpath = os.path.expanduser(GMRUN_HIST)
  cmds = OrderedDict()

  try:
    with open(histpath, 'r') as f:
      for line in f:
        line = line.rstrip('\n')
        try:
          cmds[line] += 1
        except KeyError:
          cmds[line] = 1
  except FileNotFoundError:
    pass

  try:
    del cmds[CMD]
  except KeyError:
    pass
  cmds[CMD] = 1

  with open(histpath, 'w') as f:
    for cmd in cmds:
      f.write(cmd + '\n')

  args = [os.path.basename(GMRUN_BIN)] + sys.argv[1:]
  os.execv(GMRUN_BIN, args)

try:
  main()
except KeyboardInterrupt:
  pass
