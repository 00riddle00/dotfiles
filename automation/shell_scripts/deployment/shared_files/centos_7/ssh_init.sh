#! /bin/bash   

source "$1"

echo '## Setting up users, ssh... ##'

yum install -y sudo 

useradd -m $user 

echo $user:$password | chpasswd 
echo root:$root_password | chpasswd 

usermod -aG wheel $user 
echo "$user  ALL=(ALL:ALL) ALL" >> /etc/sudoers 

yum install -y openssh-server openssh-clients 

# add sshd_config file, previously copied to virtual machine from host
echo -e  'y\n' | cp /tmp/sshd_config /etc/ssh/sshd_config 

mkdir -p /etc/ssh/$user
cat /tmp/id_rsa_$server_name.pub >> /etc/ssh/$user/authorized_keys
chown -R $user:$user /etc/ssh/$user
chmod 644 /etc/ssh/$user/authorized_keys
chmod 755 /etc/ssh/$user

# generate the host keys
ssh-keygen -A

chkconfig sshd on
service sshd restart
systemctl enable sshd

echo "## Your container base setup is complete. You can now reach it with \"ssh $server_name\""
