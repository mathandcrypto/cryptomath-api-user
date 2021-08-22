FROM node:12-alpine AS builder

WORKDIR var/www/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:12-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/www/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder  /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY . .

CMD [ "npm", "run", "start:prod" ]