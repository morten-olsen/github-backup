FROM node:16-alpine as BuildEnv
COPY package.json yarn.lock .yarnrc.yml /app/
WORKDIR /app
RUN \
  corepack enable && \
  yarn install
COPY . /app/
RUN yarn bundle

FROM node:alpine
RUN apk update && apk add git
COPY --from=BuildEnv /app/dist /app
RUN ls /app
CMD ["node", "/app/index.js"]
VOLUME /backup
