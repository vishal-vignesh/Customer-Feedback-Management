# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Accept DATABASE_URL as build argument
ARG DATABASE_URL

# Install Prisma CLI globally
RUN npm install -g prisma

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set DATABASE_URL as environment variable
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# Expose App Port
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "start"]