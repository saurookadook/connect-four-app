import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { GameSession } from '@/game-engine/schemas/game-session.schema';

export const MONGO_CONNECTION_TOKEN = getConnectionToken('DatabaseConnection');
export const GAME_SESSION_MODEL_TOKEN = getModelToken(GameSession.name);
