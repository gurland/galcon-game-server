FROM node:16 as base

WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev

COPY . .


FROM base as production
ENV NODE_PATH=./dist
RUN npm run build
