FROM node:17-alpine3.14 as bundler
RUN npm config set registry=http://registry.npm.taobao.org
WORKDIR /frontend
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build

FROM node:17-alpine3.14
WORKDIR /app
COPY --from=bundler /frontend/.next ./next
COPY --from=bundler /frontend/node_modules ./
COPY package.json package-lock.json ./

EXPOSE 3000
CMD npm run start
