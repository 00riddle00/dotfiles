SSH = 'ssh -A -i ~/git/bitfield/bitfield.pem -l ubuntu'
REPO = "git@github.com:bitfield/cookbook.git"

desc "Run puppet on ENV['CLIENT']"
task :apply do
  client = ENV['CLIENT']
  sh "git push"
  sh "#{SSH} #{client} pull-updates"
end

desc "Bootstrap Puppet on ENV['CLIENT'] with hostname ENV['HOSTNAME']"
task :bootstrap do
  client = ENV['CLIENT']
  hostname = ENV['HOSTNAME'] || client
  commands = <<BOOTSTRAP
sudo hostname #{hostname} && \
sudo echo #{hostname} >/etc/hostname && \
wget http://apt.puppetlabs.com/puppetlabs-release-precise.deb && \
sudo dpkg -i puppetlabs-release-precise.deb && \
sudo apt-get update && sudo apt-get -y install git puppet && \
echo -e \"Host github.com\n\tStrictHostKeyChecking no\n\" >> ~/.ssh/config && \
git clone #{REPO} puppet && \
sudo puppet apply --modulepath=/home/ubuntu/puppet/modules /home/ubuntu/puppet/manifests/site.pp
BOOTSTRAP
  sh "#{SSH} #{client} '#{commands}'"
end

desc "Add syntax check hook to your git repo"
task :add_check do
  here = File.dirname(__FILE__)
  sh "ln -s #{here}/hooks/check_syntax.sh #{here}/.git/hooks/pre-commit"
  puts "Puppet syntax check hook added"
end

