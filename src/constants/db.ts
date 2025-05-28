import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { GameSession } from '@/game-engine/schemas/game-session.schema';

export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_CONNECTION_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/connect-four`;
export const MONGO_CONNECTION_TOKEN = 'MONGO_CONNECTION_TOKEN';
export const MONGO_CONNECTION_TEST_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/test-connect-four`;
export const MONGO_CONNECTION_TEST_TOKEN = 'MONGO_CONNECTION_TEST_TOKEN';

export const MONGO_CONNECTION_TOKEN_TEMP =
  getConnectionToken('DatabaseConnection');
export const GAME_SESSION_MODEL_TOKEN = getModelToken(GameSession.name);
