# NGINX

Instructions: https://hub.docker.com/_/nginx

## Get and pull default config

Podman command `podman search nginx` returns a list, this
is probably the one I want: `docker.io/library/nginx`

You can search for tags, but the default limit is small, so use
this:

    podman search docker.io/library/nginx --list-tags --limit 1000

I see the one I want I think, `1.25.5`, so this will pull it:

    podman pull docker.io/library/nginx:1.25.5

Show that we have the image with `podman images`:

```
$ podman images
REPOSITORY                TAG          IMAGE ID      CREATED        SIZE
localhost/pdm-golang      latest       34aa84ac4772  41 hours ago   346 MB
<none>                    <none>       00faf8067380  41 hours ago   346 MB
<none>                    <none>       cd7bb45ed84c  41 hours ago   340 MB
docker.io/library/nginx   1.25.5       2ac752d7aeb1  5 days ago     192 MB
docker.io/library/golang  1.18-alpine  a77f45e5f987  15 months ago  340 MB
```

Now I'll run it to test.   nginx serves on port 80, so this will map
`<local port>:<container port>` so localhost will have it on 8080 and
after starting I can see the default page going to http://localhost:8080

    podman run -p 8080:80 docker.io/library/nginx

Since I didn't specify `--name <name>`, podman created one for me.   This
is 'nifty_herman':

```
$ podman ps
CONTAINER ID  IMAGE                           COMMAND               CREATED             STATUS             PORTS                 NAMES
64cf14140db4  docker.io/library/nginx:latest  nginx -g daemon o...  About a minute ago  Up About a minute  0.0.0.0:8080->80/tcp  nifty_hermann
```

## Copying from container

I can copy the default config it's running on by running this:

    podman cp nifty_hermann:/etc/nginx/conf.d/default.conf ./configs/default.conf

And the web server conf

    podman cp nifty_hermann:/etc/nginx/nginx.conf ./configs/nginx.conf

## my-nginx

So it looks like `/etc/nginx/nginx.conf` contains the main configuration.
It specifies to use the 'nginx' user, where to find mime types, logging,
and specifies to include files in `/etc/nginx/conf.d` with this:

    include /etc/nginx/conf.d/*.conf;

So `my-nginx` contains just a custom config and index.html content.

Build with:

    podman build --tag my:my-nginx -f ./Dockerfile

`podman images` shows it:

```
$ podman images
REPOSITORY                TAG          IMAGE ID      CREATED         SIZE
localhost/my              my-nginx     f4c2debc93e6  21 seconds ago  192 MB
```

Run with this, don't have to specify name I don't think, but 'my' from 'localhost/my' and tag my-nginx:

    podman run -p 8100:80 --name my-nginx my:my-nginx

Awesome, that worked and I can go to http://localhost:8100 and see my page.

## angular-7dtd

From: https://dev.to/rodrigokamada/creating-and-running-an-angular-application-in-a-docker-container-40mk

