NW_VERSION := 0.7.5

bin/nw: bin/libudev.so.0
	@curl -'#' https://s3.amazonaws.com/node-webkit/v$(NW_VERSION)/node-webkit-v$(NW_VERSION)-$(shell uname | tr [:upper:] [:lower:])-$(shell uname -m | grep -q x86_64 && echo 'x64' || echo 'ia32').tar.gz | \
		tar zxf - -C bin/ --strip-components=1

bin/libudev.so.0: bin
	ln -s /usr/lib/$(shell uname -i)-linux-gnu/libudev.so $@

bin:
	mkdir $@
