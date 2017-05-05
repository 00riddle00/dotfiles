#! /bin/bash

export HOME_DIR=$HOME/.riddle

scp root@tomasgiedraitis.com:/var/www/sync/sec.zip sec.zip && 

unzip sec.zip -d $HOME_DIR && rm -rf sec.zip &&

# TODO fix dir structure issue in zip archive
cp -r $HOME_DIR/home/riddle/.riddle/.*  $HOME_DIR/ &&
rm -rf $HOME_DIR/home/ &&

echo "### Downloaded sec ###"

