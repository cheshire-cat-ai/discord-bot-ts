FROM node:18-alpine

RUN mkdir -p /bot
WORKDIR /bot

COPY package.json /bot
RUN npm install

COPY . /bot

CMD ["npm", "run", "dev"]
