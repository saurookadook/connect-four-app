import { plainToInstance } from 'class-transformer';

import { BoardStateDTO, GameSessionDTO } from '@/game-engine/dtos';
import { BoardStateDocument, GameSessionDocument } from '@/game-engine/schemas';

export function createTransformedBoardStateDataForResponse(
  boardStateDocument: BoardStateDocument,
) {
  const boardStateJson = boardStateDocument.toJSON();

  return plainToInstance(BoardStateDTO, boardStateJson);
}

export async function createTransformedSessionDataForResponse(
  gameSessionDocument: GameSessionDocument,
) {
  const populatedSession = await gameSessionDocument.populate([
    'playerOne',
    'playerTwo',
  ]);
  const { playerOne, playerTwo, ...rest } = populatedSession.toJSON();

  return plainToInstance(GameSessionDTO, {
    ...rest,
    playerOneUsername: playerOne.username,
    playerTwoUsername: playerTwo.username,
  });
}
