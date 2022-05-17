
FROM node:lts-alpine

ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir /home/node/app/
WORKDIR /home/node/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --production

COPY .next .next
COPY public public

EXPOSE 3000

CMD npm start
