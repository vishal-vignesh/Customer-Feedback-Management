FROM node:20-alpine

WORKDIR /app

ARG DATABASE_URL

RUN npm install -g prisma

COPY package*.json ./
RUN npm install

COPY . .

ENV DATABASE_URL=${DATABASE_URL}

# ✨ FIX: remove stale prisma client
RUN rm -rf node_modules/@prisma

# Generate fresh prisma client with engineType = "binary"
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]