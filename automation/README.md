# Configuration management

<br>
## CM tools comparison
* [Ansible](#ansible)<br>
* [SaltStack](#saltstack)<br>
* [Puppet](#puppet)<br>
* [Chef](#chef)<br>
* [Fabric](#fabric)<br>

<br>
## [Sources used for research](SOURCES.md)

<br>
***
## Ansible

### Features
* Written in Python
* Yaml files
* Fastest growing
* Templates - jinja2
* Good support with vagrant, jenkins 
* Ansible galaxy (ansible playbooks online sharing)
* Less abstract package managers (package managers in playbooks should be defined explicitly)

### Pros
* Easy learning curve, least complex
* Huge community
* Secure - ssh communication (there is no pull server, agentless)
* Turing complete language in playbooks (allows looping, etc.)
* No agents to install on client nodes

### Cons
* No noop mode (dry run)
* Works only on linux
* Slower than others
* Difficulties with scalability

<br>
***
## SaltStack

### Features
* Written in Python
* Modules can be used (each module - a python file (.py)). Modules contain functions, which contain arguments.
* YAML is used, which is then complied to Python data structures for use by Salt. Hence Python can be used instead of YAML.
* Uses jinja as templating language

### Pros
* Good alternative to ansible
* Great for scaling
* Very fast
* Flexibility: 
	* Agent (minion)
	* Agentless (Salt SSH)
* Permanent, encrypted and authenticated connection (ZeroMQ \ AES)

### Cons
* Possibly less secure (using its own built security protocols instead of TLS)
* Very fast moving, hence there appear errors even in stable releases

<br>
***
## Puppet

### Features
* DSL - subset of Ruby
* Templates - Ruby
* More abstracted package managers when writing instructions (package resource)
* Resources applied randomly (unless defined explicitly, using keywords (before, require), chaining arows)
* Puppetmaster - control all of puppet nodes
* Puppet Forge - central puppet modules website

### Pros
* Noop mode
* Generating graph of resources defined with order (available to edit, hence control the order of instructions)
* Interoperability (Linux, Windows, BSD, MaxOS) 

### Cons
* Not turing complete language (DSL)
* Requires puppet agent install on client nodes
* Poor puppetization of puppetmaster server itself

<br>
***
## Chef 

### Features
* Written in Ruby and Erlang
* DSL (Ruby derived, Erlang)
* Chef Server - the main hub where Chef propagates and stores system configuration information and policies (i.e., recipes and cookbooks). The Chef management console is the web user interface for Chef Server.
* Chef Client is installed on every node being managed, the Chef Client performs configuration tasks on the local machine.
* Workstation - allows designated workstations to author/test/maintain cookbooks and upload them to Chef Server. Workstations are also used when utilizing the Chef development kit package.
* Chef Analytics - a platform that provides actions and run history, real-time reporting, and notifications around Chef automation activities.
* Chef Supermarket - an open source directory of community-contributed cookbooks

### Pros
* Good for scaling
* Good for enterprises

### Cons
* More difficult management
* Steepest learning curve

<br>
***
## Fabric 

### Features
* Written in Python
* Easiest to set up and use
* Uses ssh (just like Ansible)
* Scripts are also written in Python

### Pros
* Easy learning curve, effective for small scale deployments

### Cons
* Less possibilities, less powerful

 
