FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Verify build output exists
RUN ls -la dist/ || (echo "Build failed - dist folder not found" && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

