FROM node:20-slim

WORKDIR /mynpu-ts
COPY package*.json ./
COPY npu_usage_graph.ts ./
COPY tsconfig.json ./

RUN npm install

CMD ["npx", "ts-node", "npu_usage_graph.ts"]