import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import connectMongoDBSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

import { sharedLog } from '@connect-four-app/shared';
import { AuthModule } from '@/auth/auth.module';
import baseConfig from '@/config';
import { DatabaseModule } from '@/database/database.module';
import { HttpExceptionFilterProvider } from '@/filters/filters.providers';
import { GameEngineModule } from '@/game-engine/game-engine.module';
import { GameEventsModule } from '@/game-engine/events/game-events.module';
import { SecurityMiddleware } from '@/middleware/security.middleware';
import { isProdEnv } from '@/utils/predicates';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

const logger = sharedLog.getLogger('AppModule');

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

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      load: [baseConfig],
    }),
    AuthModule,
    DatabaseModule,
    GameEngineModule, // force formatting
    GameEventsModule,
  ],
  providers: [
    AppService, // force formatting
    HttpExceptionFilterProvider,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.SESSION_SECRET == null) {
      throw new Error("'SESSION_SECRET' environment variable is not set.");
    }

    logger.setLevel('debug');
    const { NODE_ENV, SESSION_SECRET } = process.env;

    const isProd = isProdEnv(NODE_ENV);
    const sessionStore = createSessionStore();

    consumer
      .apply(
        SecurityMiddleware,
        cookieParser(SESSION_SECRET),
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
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
