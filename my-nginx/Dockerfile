# custom 'nginx.conf' goes to /etc/nginx/nginx.conf
# all configs in 'conf.d' go to /etc/nginx/conf.d
FROM docker.io/library/nginx:1.25.5

# Do we need to remove these before copying?
# RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# copy content to where default content is served, specified
# in conf/conf.d/default.conf
COPY content /usr/share/nginx/html

# copy custom configs
COPY conf /etc/nginx