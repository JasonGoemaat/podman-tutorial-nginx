# Start with nginx image
FROM nginx:latest

# Copy the custom base configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the directory with custom configuration files
COPY conf.d /etc/nginx

# Copy the custom HTML files served by default
COPY html /usr/share/nginx/html

# Expose any ports we added, 80 is exposed by default
# EXPOSE 80
