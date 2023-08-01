#!/bin/bash

export NGNIX_CONFIG_TARGET="/etc/nginx/conf.d/public-proxy.conf"
export PROXY_PASS_TARGET_IP=?

apt update -y
apt install nginx -y

systemctl start nginx.service
systemctl enable nginx.service

bash -c "cat > $NGNIX_CONFIG_TARGET" <<EOL
server {
    listen 80;

    location / {
        proxy_pass http://$PROXY_PASS_TARGET_IP;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOL

nginx -t
systemctl restart nginx.service