FROM nginx:alpine
# Copy the website files to the nginx html directory
COPY . /usr/share/nginx/html/
=======
# Create a non-root user to own the files and run our server
RUN adduser -D -u 1000 appuser

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy package files first (if you have any)
# COPY package*.json ./

# Copy the website files to the nginx html directory
# Use .dockerignore to exclude unnecessary files
COPY . .

# Set proper permissions
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    # Create a custom nginx config to handle SPA routing (if needed)
    # echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf && \
    # Make sure nginx can read the config
    chown -R appuser:appuser /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx
# Expose port 80
EXPOSE 80

<<<<<<< HEAD
=======
# Switch to non-root user
USER appuser

>>>>>>> 05da805 (Resolved merge conflict and added Jenkinsfile)
# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
