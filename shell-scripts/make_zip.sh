#! /bin/sh

DEBUG=true

print() { 
    if $DEBUG; then
        echo "$1"
    fi
}



if [ -z "$1" ]; then
    print "ERROR: No argument supplied!"
    exit
fi


package_name=$1

file=$(ls $package_name*.zip)

if [ -f "$file" ]; then
    print "FILE EXISTS"
    mkdir -p .${package_name}_archives
    mv "$file" .${package_name}_archives

    mini=$(echo $file | grep -P '.{1}?(?=.zip)' -o)
    midi=$(echo $file | grep -P '.{1}?(?=(.[0-9]).zip)' -o)
    maxi=$(echo $file | grep -P '.{1}?(?=(.[0-9]){2}.zip)' -o)
    print $mini $midi $maxi

    if (( $mini < 9 )); then 
        print "mini <9"
        ((mini++))
    else
        mini=0;
        if (( $midi < 9 )); then 
            print "midi <9"
            ((midi++))
        else
            midi=0
            ((maxi++))
        fi
    fi
else
    print "does not exist"
    mini=0
    midi=0
    maxi=0
fi
print "HERE"
zip -r ${package_name}_${maxi}.${midi}.${mini}.zip *
