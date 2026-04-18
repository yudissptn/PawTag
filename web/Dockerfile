FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY tailwind.config.js ./
COPY postcss.config.js ./

RUN npm run build

EXPOSE 5173

CMD ["npx", "serve", "dist", "-l", "5173"]