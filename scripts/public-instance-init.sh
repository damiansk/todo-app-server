#!/bin/bash

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Setting variables"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
export NGNIX_CONFIG_TARGET="/etc/nginx/sites-available"
export NGNIX_CONFIG_FILE="default"
export PROXY_PASS_TARGET_IP=?

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Installing dependencies"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
apt update -y
apt install nginx -y

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Setting up nginx"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
systemctl start nginx.service
systemctl enable nginx.service

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Configuring nginx"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "server {
    listen 80;
    listen [::]:80;

    server_name my-domain.com;

    access_log /var/log/nginx/reverse-access.log;
    error_log /var/log/nginx/reverse-error.log;

    location / {
        proxy_pass http://$PROXY_PASS_TARGET_IP;
    }
}" >> $NGNIX_CONFIG_FILE

mv $NGNIX_CONFIG_FILE $NGNIX_CONFIG_TARGET
nginx -t

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Restarting nginx"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
systemctl restart nginx.service

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Finished"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"