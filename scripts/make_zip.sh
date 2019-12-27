#! /bin/sh

#this scripts helps to create versioned zip archives.
#example:
#> ./make_zip test
#creates archive test_0.0.0.zip with the contents of current 
#directory (recursive)
#> ./make_zip test 
#the second time it creates test_0.0.1.zip, and puts the former test_0.0.0.zip
#file inside .test_archives/ dir.

DEBUG=false

print() { 
    if $DEBUG; then
        echo "$1"
    fi
}



if [ -z "$1" ]; then
    echo "ERROR: No argument supplied!"
    exit
fi


package_name=$1


file=$(ls $package_name*.zip)
file_count=$(echo "$file" | wc -w)

if [[ $file_count -gt 1 ]]; then
    echo "ERROR: more than one such archive exists, cannot proceed."
    exit
elif [ -f "$file" ]; then
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
    echo "archive does not exist, creating one"
    mini=0
    midi=0
    maxi=0
fi
zip -r ${package_name}_${maxi}.${midi}.${mini}.zip *
