#!/bin/sh

a=0

while [ $a -lt 10 ]
do
   $SHELL_SCRIPTS_DIR/themes/matrix/run.sh
   a=`expr $a + 1`
   sleep 3
done
