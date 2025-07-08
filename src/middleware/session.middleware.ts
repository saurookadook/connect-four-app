import { INestApplication } from '@nestjs/common';
import connectMongoDBSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

import baseConfig from '@/config';
import { PlayerDetails } from '@/types/main';

export const applyGlobalSessionMiddleware = (app: INestApplication) => {
  if (process.env.SESSION_SECRET == null) {
    throw new Error("'SESSION_SECRET' environment variable is not set.");
  }

  const { NODE_ENV, SESSION_SECRET } = process.env;

  const isProd = NODE_ENV === 'prod';

  const sessionStore = createSessionStore();

  app.use(cookieParser(SESSION_SECRET));
  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: isProd ? 'strict' : 'lax',
        secure: isProd,
      },
      resave: false,
      saveUninitialized: true,
      secret: SESSION_SECRET,
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
