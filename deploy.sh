#!/usr/bin/env bash
#  환경설정 파일 복사
#  scp -i /Users/myp/aws/key/Yongpil.pem .env ubuntu@ec2-52-78-38-76.ap-northeast-2.compute.amazonaws.com:~/

ssh -i /Users/myp/aws/key/Yongpil.pem ubuntu@ec2-52-78-38-76.ap-northeast-2.compute.amazonaws.com << 'ENDSSH'
rm -rf blog-backend
git clone https://github.com/YongPilMoon/blog-backend.git
cd blog-backend
yarn install
cp ../.env .
pm2 delete all
npm start
ENDSSH


