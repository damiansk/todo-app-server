#!/bin/bash

apt-get update

apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

apt-get install nodejs -y
apt-get install mysql-client -y

mysql -h dstolarek-todo-database-private.cgf1hknohtf8.us-east-1.rds.amazonaws.com -u admin -p*yxR4Yi1NiiXHt4W < ./scripts/Tasks.sql

npm install pm2 -g && pm2 update
pm2 --version
pm2 unstartup
pm2 startup

npm ci

pm2 --name TODO_Server start npm -- start
