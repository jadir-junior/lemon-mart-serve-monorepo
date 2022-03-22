FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

CMD ["npm", "start"]