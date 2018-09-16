#!/usr/bin/env bash

ssh -i /Users/myp/aws/key/Yongpil.pem ubuntu@ec2-52-78-38-76.ap-northeast-2.compute.amazonaws.com << 'ENDSSH'
rm -rf blog-backend
git clone https://github.com/YongPilMoon/blog-backend.git
cd blog-backend
npm start
ENDSSH

