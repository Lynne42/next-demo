PROJECT ?= next-demo
REGISTRY_PROJECT ?= next-demo

DOMAIN ?=  qlniu
IMG ?= ${DOMAIN}/$(REGISTRY_PROJECT)


TAGPREFIX = v1.0.1

TAG := ${TAGPREFIX}

info:
	echo image: \"IMG:$(TAG)\" > $(OUTPUT)

build:
	docker build -t $(IMG):$(TAG) .
	docker tag $(IMG):$(TAG) $(IMG):latest
	@echo Built $(IMG):latest
	@echo Built $(IMG):$(TAG)


push:
	docker -- push $(IMG):latest
	docker -- push $(IMG):$(TAG)
	@echo Pushed $(IMG) with  :$(TAG) tags

build-push:
	make build
	make push
