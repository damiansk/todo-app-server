#!/bin/bash

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Setting variables"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
export NGNIX_CONFIG_TARGET="/etc/nginx/sites-available"
export NGNIX_CONFIG_FILE="default"

export CLIENT_APP_DIR="todo-client-app"
export SERVER_APP_DIR="todo-server-app"
export SERVER_PORT=4000

export DB_NAME='TODO_DB'
export TABLE_NAME='TASKS'
export DB_HOST=$(aws ssm get-parameter --name /upskill/devops/database/host --query "Parameter.Value" --output text)
export DB_USER=$(aws ssm get-parameter --name /upskill/devops/database/user --query "Parameter.Value" --output text)
export DB_PASSWORD=$(aws ssm get-parameter --name /upskill/devops/database/password --query "Parameter.Value" --output text)


echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Installing dependencies"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
apt update -y
apt install npm nodejs mysql-client nginx awscli -y

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Setting up client application"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
git clone https://github.com/damiansk/todo-app-client.git
npm ci --prefix todo-app-client
npm run build --prefix todo-app-client
mkdir /var/www/devops-upskill
mv -v todo-app-client/build/* /var/www/devops-upskill


echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Setting up server application"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
npm install pm2 -g
pm2 --version
pm2 unstartup
pm2 startup

git clone https://github.com/damiansk/todo-app-server.git
npm ci --prefix todo-app-server
pm2 --name todo-server start npm -- start --prefix todo-app-server

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Setting up database"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
# Uzywajac aws cli pobrac wartosci do polaczenia z db - parameter store
# Uzyc zmiennej srodowiskowej do url, user & pass
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD < ./todo-app-server/database/Tasks.sql


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

    location /api {
        proxy_pass http://127.0.0.1:$SERVER_PORT;
    }

    location / {
        root /var/www/devops-upskill/;
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