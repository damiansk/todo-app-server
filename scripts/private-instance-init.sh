#!/bin/bash

export SERVER_PORT=?
export DB_NAME=?
export TABLE_NAME=?
export DB_HOST=?
export DB_USER=?
export DB_PASSWORD=?

apt update -y
apt install npm nodejs mysql-client -y

git clone https://github.com/damiansk/todo-app-server.git

cd todo-app-server

# Uzywajac aws cli pobrac wartosci do polaczenia z db 
# Uzyc zmiennej srodowiskowej do url, user & pass
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD < ./database/Tasks.sql

npm install pm2 -g
pm2 --version
pm2 unstartup
pm2 startup

npm ci

pm2 --name TODO_Server start npm -- start