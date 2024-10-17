# Stage 1: Build the application
FROM node:20.9-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies) to build the app
RUN npm install

COPY . .

# Build the TypeScript app (outputs to 'dist' folder)
RUN npm run build


# Stage 2: Create a production image
FROM node:20.9-alpine

WORKDIR /app

# Copy only the built files from the 'build' stage
COPY --from=build /app/dist ./dist

# Also copy the necessary package.json files
COPY --from=build /app/package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]