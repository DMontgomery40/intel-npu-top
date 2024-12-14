FROM node:20-slim

WORKDIR /mynpu-ts
COPY package*.json ./
COPY *.ts ./

RUN npm install

CMD ["npx", "ts-node", "index.ts"]