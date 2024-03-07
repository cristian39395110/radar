FROM node:18-alpine

WORKDIR /csv-converter

COPY ./csv-converter/package*.json .

RUN yarn

COPY ./csv-converter/. .

RUN yarn build

