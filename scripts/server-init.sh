#!/bin/bash

apt-get update

apt-get install curl
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install nodejs

npm ci
npm start