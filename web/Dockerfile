FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY .env* ./
COPY index.html
COPY src/ ./src/
COPY public/ ./public/
COPY vite.config.ts ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]