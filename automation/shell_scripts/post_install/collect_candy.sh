#! /bin/bash

export HOME_DIR=$HOME/.riddle

zip -r candy.zip $HOME_DIR/.candy &&

scp candy.zip root@tomasgiedraitis.com:/var/www/sync/ && rm -rf candy.zip &&

echo "### Collected candy ###"
