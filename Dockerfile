FROM node:17-alpine3.14 AS bundler
WORKDIR /frontend
COPY package.json ./
COPY package-lock.json ./
RUN npm install --registry=http://registry.npm.taobao.org
COPY . .
RUN npm run build

FROM node:17-alpine3.14
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production
COPY --from=bundler /frontend/.next ./.next
COPY --from=bundler /frontend/public ./public
# COPY --from=bundler /frontend/node_modules ./node_modules

EXPOSE 3000
CMD npm run start
