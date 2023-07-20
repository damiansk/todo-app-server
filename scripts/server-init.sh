#!/bin/bash

apt-get update

apt-get install curl
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

apt-get install nodejs
apt-get install mysql-client

mysql -h dstolarek-todo-database-private.cgf1hknohtf8.us-east-1.rds.amazonaws.com -u admin -p *yxR4Yi1NiiXHt4W < ./Tasks.sql

npm ci
npm start