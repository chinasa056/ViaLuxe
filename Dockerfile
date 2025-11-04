FROM node:20-slim

# Install required system dependencies for Prisma
RUN apt-get update -y \
  && apt-get install -y openssl libssl-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3009

# Run the app
CMD ["npm", "run", "start:dev"]
