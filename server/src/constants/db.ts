import { getConnectionToken, getModelToken } from '@nestjs/mongoose';

import { BoardState } from '@/game-engine/schemas/board-states.schema';
import { GameSession } from '@/game-engine/schemas/game-session.schema';
import { Player } from '@/player/schemas/player.schema';

export const MONGO_CONNECTION_TOKEN = getConnectionToken('DatabaseConnection');
export const BOARD_STATE_MODEL_TOKEN = getModelToken(BoardState.name);
export const GAME_SESSION_MODEL_TOKEN = getModelToken(GameSession.name);
export const PLAYER_MODEL_TOKEN = getModelToken(Player.name);
