FROM node:14 AS build

WORKDIR /usr/src/app

COPY .babelrc ./
COPY package*.json ./
COPY webpack.server.build.config.js ./
COPY webpack.client.build.config.js ./
COPY src src
COPY assets assets
COPY public public

RUN npm install
RUN npm run build

FROM node:14

WORKDIR /usr/src/app

ENV NODE_ENV production
ENV JWT_SECRET JWT_SECRET
ENV username YOUR_USERNAME
ENV password YOUR_PASSWORD
ENV database YOUR_DATABASE
ENV host YOUR_HOST
ENV AWS_ACCESS_KEY_ID AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY AWS_SECRET_ACCESS_KEY

COPY --from=build /usr/src/app/package.json package.json
COPY --from=build /usr/src/app/dist dist
COPY start.sh start.sh
COPY src/server src/server

RUN npm install --only=production
RUN npm install -g mysql2 sequelize sequelize-cli

EXPOSE 8000
CMD [ "sh", "start.sh" ]
