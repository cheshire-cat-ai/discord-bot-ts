FROM node:18-alpine

RUN npm i -g npm

RUN mkdir -p /bot
WORKDIR /bot

COPY package.json pnpm-lock.yaml ./bot/
RUN pnpm install

COPY . /bot

CMD ["pnpm", "dev"]
