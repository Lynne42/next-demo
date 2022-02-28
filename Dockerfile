FROM node:17-alpine3.14 as bundler
RUN npm config set registry=http://registry.npm.taobao.org
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:17-alpine3.14
COPY --from=bundler /frontend/* ./

EXPOSE 3000
CMD npm run start