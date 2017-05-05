#! /bin/bash

# -----------------------------------
# This script is used for:

# [1] downloading lxc image
# [2] running lxc container
# [3] setting up ssh inside lxc
# -----------------------------------

source "$1"

file_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/$(basename $BASH_SOURCE)"
main_dir=`echo $file_path | sed 's/\/deployment\/.*/\/deployment/'`

echo $main_dir


# download lxc image
lxc-create -t download -n $server_name -- -d $os -r $os_version -a $arch > /dev/null 2>&1

echo '## Building your container...##'

echo -e  'y\n' | ssh-keygen -t rsa -b 4096 -C "$email" -f $HOME/.ssh/id_rsa_$server_name -q -N ""

cp $var_file_path $path/tmp

cp $HOME/.ssh/id_rsa_$server_name.pub $path/tmp

sudo sed "s/{{ user }}/$user/g" $main_dir/shared_files/centos_7/sshd_config | sudo tee $path/tmp/sshd_config > /dev/null 2>&1

cp $main_dir/shared_files/centos_7/ssh_init.sh $path/tmp

echo "
Host $server_name
  HostName $server_name
  User $user
  IdentityFile $HOME/.ssh/id_rsa_$server_name
  IdentitiesOnly yes
" >> $HOME/.ssh/config

lxc-start -d -n $server_name > /dev/null 2>&1

echo "Starting container..."

sleep 15

ip="$(lxc-ls -f | grep $server_name | awk '{print $3}')" 
su -c "echo $ip $server_name >> /etc/hosts"

lxc-attach -n $server_name -- /bin/bash /tmp/ssh_init.sh /tmp/$var_file

ssh-keygen -R $server_name
ssh-keyscan -H $server_name >> ~/.ssh/known_hosts

echo "## Your container (name=$name) has been built successfully. ##"
echo "## You can reach it with \"ssh $name\" ###"
