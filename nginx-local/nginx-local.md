# nginx-local

**Image to run nginx using configs on the host machine.**

First I start a new nginx container, I will name 'nginx-local',
and expose nginx port 80 as port 8200 on my pc.  Using `run`
will take over the current shell and you will see the output from
nginx, and when you hit CTRL+C to stop it the container will stop.
Use the `-d` flag to run it detached

    podman run --name nginx-local -p 8200:80 nginx:latest

Going to http://localhost:8200 shows the nginx welcome page, so that's good.
Now I will copy files from the container to this directory:

Now the container exists in podman, changes made to it will be saved
to that container only when you use `podman stop nginx-local` and
start it again using `podman start nginx-local`.

* `nginx.conf` - main config, imports all '.conf' files in the `conf.d` directory
* `conf.d` - config subdirectory, all '.conf' files imported into nginx config
* `html` - location served by default config

    podman cp nginx-local:/etc/nginx/nginx.conf .
    podman cp nginx-local:/etc/nginx/conf.d .
    podman cp nginx-local:/usr/share/nginx/html .

## Updating files in running instance::

If you want, you can make changes to these files/directories and copy them back to
the running container.   First make a trivial change to `html/index.html` changing
the heading to 'CHANGED!' for example.  Then this *should* work, **but doesn't**:

    podman cp ./html nginx-local:/usr/share/nginx

To make this work, we run a special command using `wsl.exe` to run the copy command
on the podman VM as the user 'user' (if running rootless, change to 'root' if
running as root) and using `enterns` to enter the correct 'namespace' for
accessing the same podman machine:

    wsl -d podman-machine-default -u user enterns podman cp ./html nginx-local:/usr/share/nginx

Refreshing the page then shows the changes.  If updating the configs and copying
them that way, you need to restart the container or run this to signal nginx to
reload configs:

    podman exec nginx-local nginx -s reload

## Creating a new image with updated files

See 'Dockerfile' for what is done, basically we start with the `nginx` image
and copy our custom configurations and html:

    FROM nginx:latest
    COPY nginx.conf /etc/nginx/nginx.conf
    COPY conf.d /etc/nginx
    COPY html /usr/share/nginx/html

Then we can run `podman build .`, but this would just give us an image id and no
other way to reference it.  In this case you can use `podman images` and see it,
then run like so (15a602a8ceb8 being the id it gave the container):

    podman build .
    podman run --name nginx-local2 -p 8201:80 15a602a8ceb8

During the build we could also give it a tag 'custom-nginx' to use that instead:

    podman build . --tag custom-nginx

And view it:

    PS C:\git\github\podman-tutorial-nginx\nginx-local> podman images
    REPOSITORY               TAG         IMAGE ID      CREATED        SIZE
    localhost/custom-nginx   latest      15a602a8ceb8  4 minutes ago  192 MB

And run it:

    podman run --name nginx-local2 -p 8201:80 custom-nginx

## Mounting

You can mount local directories in podman.   This will let you change html
files and config files (except `nginx.conf` which is in a directory with other
files and a symlink we can't copy or mount from windows) and see the changes
without copying to the container.   You still have to run the command
`podman exec nginx-mounted nginx -s reload` to tell the the nginx process
to reload the configs:

    podman run --name nginx-mounted -p 8202:80 -v ./mounted_html:/usr/share/nginx/html -v ./conf.d:/etc/nginx/conf.d nginx