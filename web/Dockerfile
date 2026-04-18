FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm run build

COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY dist/ ./dist/

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]