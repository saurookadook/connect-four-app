import { UUID } from 'node:crypto';

import {
  GameBoard,
  GameSessionStatus,
  PlayerColor,
} from '@/game-logic-engine/constants';
import { LogicBoard } from '@/game-logic-engine';

export class LogicSession {
  #activePlayer: PlayerColor;
  #board: LogicBoard;
  // players: UUID[]; // TODO: maybe this would be simpler...?
  #playerOneID: UUID;
  #playerTwoID: UUID;
  #status: GameSessionStatus;

  constructor({
    activePlayer, // force formatting
    boardState,
    playerOneID,
    playerTwoID,
    status,
  }: {
    activePlayer?: PlayerColor;
    boardState?: GameBoard;
    playerOneID: UUID;
    playerTwoID: UUID;
    status?: GameSessionStatus;
  }) {
    this.#activePlayer = activePlayer ?? PlayerColor.RED;
    this.#board = new LogicBoard({ gameBoardState: boardState });
    this.#playerOneID = playerOneID;
    this.#playerTwoID = playerTwoID;
    this.#status = status ?? GameSessionStatus.ACTIVE;
  }
}
