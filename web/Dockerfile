FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]