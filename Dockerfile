FROM node:17-alpine3.14 AS bundler
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install --registry=http://registry.npm.taobao.org
COPY . .
RUN npm run build

FROM node:17-alpine3.14

COPY --from=bundler /frontend/.next ./.next
COPY --from=bundler /frontend/node_modules ./node_modules
COPY package.json package-lock.json ./


EXPOSE 3000
CMD npm run start
