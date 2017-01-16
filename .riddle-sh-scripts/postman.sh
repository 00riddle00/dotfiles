#!/bin/sh

postman="google-chrome-stable --profile-directory=Default --app-id=fhbjgbiflinjbdggehcddcbncdddomop"

 
# no firefox started, so start one
if [ -z  "`wmctrl -lx | grep Postman`" ]; then
    $postman &
# firefox is opened, so focus on it
else
    wmctrl -a  postman
fi;
