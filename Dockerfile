FROM node:18-alpine

RUN npm i -g pnpm

RUN mkdir -p /bot

COPY package.json /bot
COPY pnpm-lock.yaml /bot

WORKDIR /bot

RUN pnpm install

COPY . /bot

CMD ["pnpm", "dev"]
