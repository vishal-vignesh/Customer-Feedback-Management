# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Prisma CLI
RUN npm install -g prisma

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose App Port
EXPOSE 3000

CMD ["node", "server.js"]