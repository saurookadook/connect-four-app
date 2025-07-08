import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { GameSession } from '@/game-engine/schemas/game-session.schema';
import { Player } from '@/player/schemas/player.schema';

export const MONGO_CONNECTION_TOKEN = getConnectionToken('DatabaseConnection');
export const GAME_SESSION_MODEL_TOKEN = getModelToken(GameSession.name);
export const PLAYER_MODEL_TOKEN = getModelToken(Player.name);
