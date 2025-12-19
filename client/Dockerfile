# -------- Dependencies layer --------
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# -------- Build layer --------
FROM node:20-alpine AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# -------- Runtime layer --------
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
