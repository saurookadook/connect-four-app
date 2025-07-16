FROM node:22-bullseye AS client-dev-base
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
ENV YARN_VERSION=4.8.1
ENV yarn='corepack yarn'
EXPOSE 5173
WORKDIR /opt/connect-four-app/
COPY .env .yarnrc.yml package.json yarn.lock /opt/connect-four-app/
COPY client/ /opt/connect-four-app/client/
RUN corepack enable
RUN corepack use yarn@$YARN_VERSION
RUN $yarn client:base build

FROM client-dev-base AS client-dev
ENTRYPOINT [ "yarn", "client:base" ]
CMD [ "start:dev" ]

FROM client-dev-base AS client-test
COPY .env.test /opt/connect-four-app
ENTRYPOINT [ "yarn", "client:base" ]
CMD [ "test" ]
