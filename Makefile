NW_VERSION := 0.7.5

bin/nw: bin/libudev.so.0
	@curl -'#' https://s3.amazonaws.com/node-webkit/v$(NW_VERSION)/node-webkit-v$(NW_VERSION)-$(shell uname | tr [:upper:] [:lower:])-$(shell uname -m | grep -q x86_64 && echo 'x64' || echo 'ia32').tar.gz | \
		tar zxf - -C bin/ --strip-components=1

bin/libudev.so.0: bin
	ln -s /usr/lib/$(shell uname -i)-linux-gnu/libudev.so $@

bin:
	mkdir $@

# Dependencies
# ------------

SUBTREE_PATHS := $(shell cat .gittrees | grep 'subtree' | cut -d' ' -f2 | tr -d '"]')
SUBTREE_CONFIG_CMD = $(shell git config -f .gittrees subtree.$1.$2)

GIT_BIN := /usr/bin/git

.PHONY: $(SUBTREE_PATHS)

$(SUBTREE_PATHS): $(GIT_BIN)
	@$(eval SUBTREE_REMOTE_BRANCH := $(call SUBTREE_CONFIG_CMD,$@,branch))
	@$(eval LOCAL_BRANCH := $(shell git rev-parse --abbrev-ref HEAD))
	@$(eval LOCAL_PATH := $(call SUBTREE_CONFIG_CMD,$@,path))
	@printf 'Checking if the Git remote "%s" exists... ' '$@'
	@if git remote -v | grep -q '$@'; then \
		echo 'fetching changes...' ; \
		git fetch '$@' ; \
	else \
		echo 'adding with changes...' ; \
		git remote add -f -t '$(SUBTREE_REMOTE_BRANCH)' '$@' '$(call SUBTREE_CONFIG_CMD,$@,url)' ; \
	fi
	@if ! git diff-files --quiet; then \
		echo 'Stashing working copy changes before proceeding...' ; \
		git stash save -q 'before-update: $@' ; \
	fi
	@if [ -d '$(LOCAL_PATH)' ]; then \
		echo 'Updating subtree in "$(LOCAL_PATH)"...' ; \
		git subtree merge --prefix='$(LOCAL_PATH)' --squash '$@/$(SUBTREE_REMOTE_BRANCH)' -m "Update '$@' subtree in '$(LOCAL_PATH)'." || true ; \
	else \
		echo 'Adding subtree in "$(LOCAL_PATH)"...' ; \
		git subtree add --prefix='$(LOCAL_PATH)' --squash '$@/$(SUBTREE_REMOTE_BRANCH)' -m "Initial commit of '$@' subtree in '$(LOCAL_PATH)'." || true ; \
	fi
	@echo 'Cleaning up...'
	@git remote rm '$@'
	@if git stash list | grep -q 'before-update: $@'; then \
		echo 'Applying stashed changes...' ; \
		git stash pop -q "$$( git stash list | grep 'before-update: $@' | tail -1 | cut -d':' -f1 )" ; \
	fi

$(GIT_BIN):
	@echo '>>> You must install Git first.' 1>&2
	@exit 1
