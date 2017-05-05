#! /bin/bash

export HOME_DIR=$HOME/.riddle

zip -r sec.zip $HOME_DIR/.sec &&

scp sec.zip root@tomasgiedraitis.com:/var/www/sync/ && rm -rf sec.zip &&

echo "### Collected sec ###"
