#! /bin/bash


# -----------------------------------
# This script is used for:

# [1] downloading docker image
# [2] running docker container
# [3] setting up ssh inside docker
# -----------------------------------


source "$1"

file_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/$(basename $BASH_SOURCE)"                                                  
main_dir=`echo $file_path | sed 's/\/deployment\/.*/\/deployment/'`  

docker run --hostname $server_name -p $http_port:80 -p $ssh_port:22 --name $server_name --privileged -e "container=docker" -v /sys/fs/cgroup:/sys/fs/cgroup  -d centos:latest tail -f /dev/null 

echo '## Building your container...##'

ip=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' "$@" $server_name)

su -c "echo $ip $server_name >> /etc/hosts"

echo -e  'y\n' | ssh-keygen -t rsa -b 4096 -C "$email" -f $HOME/.ssh/id_rsa_$server_name -q -N ""

docker cp $HOME/.ssh/id_rsa_$server_name.pub $server_name:/tmp

docker cp $var_file_path $server_name:/tmp

sudo sed "s/{{ user }}/$user/g" $main_dir/shared_files/centos_7/sshd_config | sudo tee sshd_config.docker > /dev/null 2>&1 
docker cp sshd_config.docker $server_name:/tmp/sshd_config && rm sshd_config.docker

docker cp $main_dir/shared_files/centos_7/ssh_init.sh $server_name:/tmp

echo "
Host $server_name
  HostName $server_name
  Port $ssh_port
  User $user
  IdentityFile $HOME/.ssh/id_rsa_$server_name
  IdentitiesOnly yes
" >> $HOME/.ssh/config

ssh-keygen -R $server_name
ssh-keyscan -H $server_name >> ~/.ssh/known_hosts

docker exec $server_name /bin/bash /tmp/ssh_init.sh /tmp/$var_file

