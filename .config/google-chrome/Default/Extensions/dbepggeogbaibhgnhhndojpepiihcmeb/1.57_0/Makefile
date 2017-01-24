
remote = desktop:/data/vimium/
rsync = rsync -av --delete

build:
	cake build

autobuild:
	cake autobuild

test:
	cake test

backup:
	$(rsync) ./ $(remote)

restore:
	$(rsync)  $(remote) ./

amend:
	git add .
	git commit --amend

