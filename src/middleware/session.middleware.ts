import { INestApplication } from '@nestjs/common';
import * as connectMongoDBSession from 'connect-mongodb-session';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import baseConfig from '@/config';
import { PlayerDetails } from '@/types/main';

export const applyGlobalSessionMiddleware = (app: INestApplication) => {
  if (process.env.SESSION_SECRET == null) {
    throw new Error("'SESSION_SECRET' environment variable is not set.");
  }

  const secretKey = process.env.SESSION_SECRET;
  const sessionStore = createSessionStore();

  app.use(cookieParser(secretKey));
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: true,
      },
      resave: false,
      saveUninitialized: false,
      secret: secretKey,
      store: sessionStore,
    }),
  );
  setUpPassport(app);
};

function createSessionStore() {
  const { ENV, NODE_ENV } = process.env;
  if (ENV === 'test' || NODE_ENV === 'test') {
    return;
  }

  const MongoDBStore = connectMongoDBSession(session);
  const { dbName, host, port } = baseConfig().database;

  return new MongoDBStore({
    collection: 'player_sessions',
    databaseName: dbName,
    uri: `mongodb://${host}:${port}/${dbName}`,
  });
}

function setUpPassport(app: INestApplication) {
  passport.serializeUser(function (user: PlayerDetails, callback) {
    process.nextTick(function () {
      return callback(null, {
        playerID: user.playerID,
        playerObjectID: user.playerObjectID, // MongoDB ObjectId
        username: user.username,
      });
    });
  });

  passport.deserializeUser(function (user: PlayerDetails, callback) {
    process.nextTick(function () {
      return callback(null, user);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());
}
