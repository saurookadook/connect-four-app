import { UUID } from 'node:crypto';
import { inspect } from 'node:util';

import { LogicBoard, LogicSession } from '@/game-logic-engine';
import { GameSessionStatus, PlayerColor } from '@/game-logic-engine/constants';
import validatorFuncs, {
  ValidatorFunc,
} from '@/game-logic-engine/validator-funcs';

export class GameLogicEngine {
  #validatorFuncs: ValidatorFunc[];

  constructor() {
    this.#validatorFuncs = validatorFuncs;
  }

  startGame({
    playerOneID, // force formatting
    playerTwoID,
  }: {
    playerOneID: UUID;
    playerTwoID: UUID;
  }): LogicSession {
    try {
      return new LogicSession({
        playerOneID,
        playerTwoID,
      });
    } catch (error) {
      console.error(
        '[ClientGameEngine.startGame] Encountered ERROR initializing game session: ',
        error,
      );
      throw error;
    }
  }

  handleMove({
    columnIndex, // force formatting
    playerID,
    sessionRef,
  }: {
    columnIndex: number;
    playerID: UUID;
    sessionRef: LogicSession;
  }): LogicSession {
    sessionRef.updateBoard({
      column: columnIndex,
      playerID: playerID,
    });

    if (this.checkForWin(sessionRef.board, sessionRef.activePlayer)) {
      return this.endGame(sessionRef);
    }

    sessionRef.changeActivePlayer();

    return sessionRef;
  }

  checkForWin(board: LogicBoard, activePlayer: PlayerColor): boolean {
    const lastUpdatedCell = board.lastUpdatedCell;

    if (lastUpdatedCell == null) return false;

    const activePlayerHasWon = this.#validatorFuncs.some((validatorFunc) => {
      return validatorFunc(
        board.gameBoardState, // force formatting
        lastUpdatedCell.column,
        lastUpdatedCell.row,
        activePlayer,
      );
    });

    return activePlayerHasWon;
  }

  endGame(sessionRef: LogicSession) {
    sessionRef.status = GameSessionStatus.COMPLETED;

    return sessionRef;
  }
}
