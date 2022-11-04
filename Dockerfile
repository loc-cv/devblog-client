FROM node:alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY pnpm-*.yaml ./
COPY package.json ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD [ "pnpm", "run", "dev" ]
