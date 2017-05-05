#! /bin/bash

export HOME_DIR=$HOME/.riddle

scp root@tomasgiedraitis.com:/var/www/sync/candy.zip candy.zip && 

unzip candy.zip -d $HOME_DIR && rm -rf candy.zip &&

# TODO fix dir structure issue in zip archive
cp -r $HOME_DIR/home/riddle/.riddle/.*  $HOME_DIR/ &&
rm -rf $HOME_DIR/home/ &&

echo "### Downloaded candy ###"

