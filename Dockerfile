# Build stage
FROM node:22-alpine AS builder

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

# Runtime stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /build .

EXPOSE 7860

CMD ["node", "app.js"]