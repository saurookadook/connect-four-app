import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { GameSession } from '@/game-engine/schemas/game-session.schema';

export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_CONNECTION = `mongodb://${MONGO_HOST}:${MONGO_PORT}/connect-four`;

export const MONGO_CONNECTION_TOKEN = getConnectionToken('DatabaseConnection');
export const MONGO_DB_CONNECTION = 'MONGO_DB_CONNECTION';
export const GAME_SESSION_MODEL_TOKEN = getModelToken(GameSession.name);
export const GAME_SESSION_MODEL = 'GAME_SESSION_MODEL';
