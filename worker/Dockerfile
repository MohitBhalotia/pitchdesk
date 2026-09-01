# Built with the repo root as build context (see docker-compose.yml) so the
# worker can import Mongoose models straight from ../src/models with zero
# schema duplication, per plans/RAG_feature.md Section 4.
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "tsx", "worker/src/index.ts"]
