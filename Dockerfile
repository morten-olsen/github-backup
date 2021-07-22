FROM node:alpine as BuildEnv
COPY package.json /app/package.json
WORKDIR /app
RUN yarn install
COPY . /app/
RUN yarn bundle

FROM node:alpine
RUN apk update && apk add git
COPY --from=BuildEnv /app/dist /app
RUN ls /app
CMD ["node", "/app/index.js"]
VOLUME /backup
