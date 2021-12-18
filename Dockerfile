FROM node:16-alpine as BuildEnv
COPY package.json yarn.lock .yarnrc.yml /app/
WORKDIR /app
RUN \
  corepack enable && \
  yarn install
COPY . /app/
RUN yarn bundle

FROM node:alpine
COPY entry.sh /entry.sh
RUN chmod 755 /entry.sh && apk update && apk add git
COPY --from=BuildEnv /app/dist /app
CMD ["schedule"]
ENTRYPOINT ["/entry.sh"]
VOLUME /backup
