# NGINX

Instructions: https://hub.docker.com/_/nginx

## Finding

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


