# 1. Use official Node.js image as the base image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package files & install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4. Copy the rest of the code
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Use smaller image for runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only required files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 7. Expose port 3000
EXPOSE 3000

# 8. Start Next.js in server mode
CMD ["npm", "run", "start"]
