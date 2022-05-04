FROM node:latest AS builder 
ENV NODE_ENV production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm install 
USER node
CMD ["npm", "start"]

FROM node:lts-alpine
RUN mkdir -p /var/www/app
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
EXPOSE 80
EXPOSE 443
CMD ["npm", "start"]
