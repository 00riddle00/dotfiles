import 'nodes.pp'

file { '/tmp/hello':
	content => "Hello, world\n",
}

