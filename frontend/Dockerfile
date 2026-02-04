# build
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_AUTHORS_API_URL
ARG VITE_PUBLICATIONS_API_URL

ENV VITE_AUTHORS_API_URL=$VITE_AUTHORS_API_URL
ENV VITE_PUBLICATIONS_API_URL=$VITE_PUBLICATIONS_API_URL

COPY package*.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

RUN npm run build

# run
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
