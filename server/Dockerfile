FROM node:22-bullseye AS server-dev-base
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
ENV YARN_VERSION=4.8.1
ENV yarn='corepack yarn'
WORKDIR /opt/connect-four-app/
COPY .env .yarnrc.yml package.json yarn.lock /opt/connect-four-app/
COPY server/ /opt/connect-four-app/server/
COPY shared/ /opt/connect-four-app/shared/
RUN corepack enable
RUN corepack use yarn@$YARN_VERSION
RUN $yarn shared:base build
RUN $yarn server:base build

FROM server-dev-base AS server-dev
EXPOSE 3993 8090
ENTRYPOINT [ "yarn", "server:base" ]
CMD [ "start:dev" ]

FROM server-dev-base AS server-test
EXPOSE 3030 8099
ENTRYPOINT [ "yarn", "server:base" ]
CMD [ "test" ]


#########################################################################################

# TODO: can something like this work so that I don't have to repeat copy/paste
# the ARGs/ENV variables between stages?
FROM node:22-bullseye AS node-base
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
ENV YARN_VERSION=4.8.1
ENV yarn='corepack yarn'

####### For debugging - run with `--progress=plain` flag
# RUN echo "================================================================"
# RUN echo "$(ls -la)"
# RUN echo "----------------------------------------------------------------"
# RUN echo "YARN VERSION =====> $(yarn --version)"
# RUN echo "================================================================"
