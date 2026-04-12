FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ ./src/
COPY .env* ./
COPY tsconfig.json ./

EXPOSE 10000

CMD ["npm", "start"]