#!/bin/bash

apt-get update

apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

apt-get install nodejs -y
apt-get install mysql-client -y

mysql -h dstolarek-todo-database-private.cgf1hknohtf8.us-east-1.rds.amazonaws.com -u admin -p *yxR4Yi1NiiXHt4W < ./scripts/Tasks.sql

npm ci
npm start