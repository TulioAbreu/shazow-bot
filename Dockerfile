FROM node:15.2.0-alpine3.10

COPY . /shazow-bot

RUN cd /shazow-bot && yarn && yarn build

WORKDIR /shazow-bot
