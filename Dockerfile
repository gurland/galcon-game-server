FROM node:16.14.2 as base

WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev

COPY . .


FROM base as production
RUN npm run build
