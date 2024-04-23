# test-network1

I found [this SO Answer](https://stackoverflow.com/a/71427278/369792)
that provides so much information I just couldn't find easily about
communications between pods and containers.

So it looks like you can create a `network` and specify that when creating
pods or containers and they will be on the same network.   And you can
access pods by their container name if they are in the same network,
or you can specify `--hostname <hostname>` when creating a container..

## Simple two container setup, no hostname

```
podman network create test-network1
podman network inspect test-network1
podman run --name test-network1-nginx --network test-network1 docker.io/library/nginx:1.25.5
```

Ok, that is running (`podman ps`) but has no port mapping, let's try running another
container on the network with a shell:

    podman run -it --name test-network1-shell --network test-network1 docker.io/library/alpine

Then in the shell:

    apk add --no-cache curl

Then this works:

    curl www.google.com

And this!  Sweet!

    curl test-network1-nginx

    curl 