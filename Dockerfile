FROM node:12 AS development

WORKDIR var/www/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:12 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/www/app

COPY --from=development /var/www/app/node_modules ./node_modules
COPY --from=development  /var/www/app/package*.json ./
COPY --from=development  /var/www/app/dist ./dist

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]