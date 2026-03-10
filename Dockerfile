FROM node:20-alpine

WORKDIR /app

ARG DATABASE_URL

# Install Prisma CLI globally
RUN npm install -g prisma

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project (including prisma folder)
COPY . .

# Set DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# ⚠️ MUST BE AFTER COPYING THE PRISMA FOLDER
RUN npx prisma generate

# Build Next.js application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]