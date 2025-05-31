import { Db, MongoClient } from 'mongodb';
import * as mongoose from 'mongoose';

import { GAME_SESSION_MODEL_TOKEN, MONGO_HOST, MONGO_PORT } from '@/constants';

global.__MONGO_URI__ = `mongodb://${MONGO_HOST}:${MONGO_PORT}/test-connect-four`;

// let connection: MongoClient;
// let db: Db;

// beforeAll(async () => {
//   connection = await MongoClient.connect(global.__MONGO_URI__, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   });
//   db = connection.db();
// });

// beforeEach(async () => {
//   await db.collection(GAME_SESSION_MODEL_TOKEN).deleteMany({});
// });

// afterAll(async () => {
//   await connection.close();
// });
