// import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';

import { GAME_SESSION_MODEL_TOKEN, MONGO_HOST, MONGO_PORT } from '@/constants';

global.__MONGO_URI__ = `mongodb://${MONGO_HOST}:${MONGO_PORT}/test`;

let mongod: MongoMemoryServer;
let mongoConnection: Connection;
// let connection: MongoClient;
// let db: Db;

// beforeAll(async () => {
//   mongod = await MongoMemoryServer.create({
//     instance: {
//       dbName: 'test-connect-four',
//     },
//   });
//   mongoConnection = (await connect(mongod.getUri())).connection;

//   global.mongod = mongod;
//   global.mongoConnection = mongoConnection;

//   // connection = await MongoClient.connect(global.__MONGO_URI__, {
//   //   // useNewUrlParser: true,
//   //   // useUnifiedTopology: true,
//   // });
//   // db = connection.db();
// });

// // beforeEach(async () => {
// //   await db.collection(GAME_SESSION_MODEL_TOKEN).deleteMany({});
// // });

// afterAll(async () => {
//   await (global.mongoConnection as Connection).dropDatabase();
//   await (global.mongoConnection as Connection).close();
//   await (global.mongod as MongoMemoryServer).stop();
// });
