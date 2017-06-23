#! /bin/bash

zip -r $HOME_DIR/.riddle-candy.zip $CANDY &&
cp $HOME_DIR/.riddle-candy.zip  $USER_HOME_DIR/tmp1 &&
rm $HOME_DIR/.riddle-candy.zip

echo "### Synced candy ###"


