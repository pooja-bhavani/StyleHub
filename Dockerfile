FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY . .

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
        index index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|avif)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
