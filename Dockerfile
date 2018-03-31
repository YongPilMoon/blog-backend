FROM node:carbon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 4000
CMD ["yarn", "start"]