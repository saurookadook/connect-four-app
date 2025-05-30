import { inspect } from 'node:util';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Db, MongoClient } from 'mongodb';
import * as mongoose from 'mongoose';

import { GAME_SESSION_MODEL_TOKEN, MONGO_HOST, MONGO_PORT } from '@/constants';

global.__MONGO_URI__ = `mongodb://${MONGO_HOST}:${MONGO_PORT}/test-connect-four`;

console.log({ NODE_ENV: process.env.NODE_ENV });

mongoose.set('debug', true);
mongoose.connection.on('error', (error) => {
  console.error('[mongoose:MongoDB Connection] - ERROR:', error);
});

// let connection: typeof mongoose | void;
let connection: mongoose.Connection;
let db: Db;

// beforeAll(async () => {
//   const module: TestingModule = await Test.createTestingModule({
//     imports: [
//       MongooseModule.forRootAsync({
//         useFactory: () => ({
//           bufferCommands: false,
//           dbName: 'test-connect-four',
//           onConnectionCreate: (connection: mongoose.Connection) => {
//             const logPrefix = '[MongoDB Connection] - ';
//             connection.on('connected', () =>
//               console.log(logPrefix + 'connected'),
//             );
//             connection.on('open', () => console.log(logPrefix + 'open'));
//             connection.on('error', (error) => {
//               console.error(logPrefix + 'error', error);
//             });
//             connection.on('disconnected', () =>
//               console.log(logPrefix + 'disconnected'),
//             );
//             connection.on('reconnected', () =>
//               console.log(logPrefix + 'reconnected'),
//             );
//             connection.on('disconnecting', () =>
//               console.log(logPrefix + 'disconnecting'),
//             );

//             return connection;
//           },
//           uri: 'mongodb://0.0.0.0:27017/test-connect-four',
//         }),
//       }),
//     ],
//   }).compile();

//   connection = module.get<mongoose.Connection>(getConnectionToken());
//   // connection = await mongoose
//   //   .connect(global.__MONGO_URI__, {
//   //     bufferCommands: false,
//   //   })
//   //   .catch((error) => {
//   //     console.error(
//   //       '[mongoose:MongoDB Connection] - ERROR opening connection:',
//   //       error,
//   //     );
//   //   });
//   console.log(
//     '    GameSessionService test - beforeAll    '
//       .padStart(100, '=')
//       .padEnd(180, '='),
//   );
//   console.log(
//     inspect(
//       {
//         connection,
//         collections: connection.collections,
//         models: connection.models,
//       },
//       { colors: true, depth: 2, showHidden: true },
//     ),
//   );
//   console.log(''.padStart(180, '='));
// });

// beforeEach(async () => {
//   await db.collection(GAME_SESSION_MODEL_TOKEN).deleteMany({});
// });

// afterAll(async () => {
//   // await (connection as typeof mongoose).connection.close();
//   await connection.close();
// });
