
FROM node:22

RUN npm install -g pnpm

RUN pnpm config set global-bin-dir /usr/local/bin

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm add -g pm2

RUN pnpm run build

EXPOSE 3001

CMD ["pm2", "start", "dist/bin/www.js", "--no-daemon"]
