import { UUID } from 'node:crypto';

import {
  GameSessionStatus,
  PlayerColor,
  sharedLog,
  type PlayerMove,
} from '@connect-four-app/shared';
import { PlayerDTO } from '@/player/dtos/player.dto';
import validatorFuncs, { ValidatorFunc } from './validator-funcs';
import { LogicBoard, LogicSession } from './';

const logger = sharedLog.getLogger('GameLogicEngine');

export class GameLogicEngine {
  // TODO: maybe this should be static?
  #validatorFuncs: ValidatorFunc[];

  constructor() {
    this.#validatorFuncs = validatorFuncs;
  }

  startGame({
    moves,
    playerOneID, // force formatting
    playerTwoID,
  }: {
    moves?: PlayerMove[];
    playerOneID: UUID;
    playerTwoID: UUID;
  }): LogicSession {
    try {
      const logicSession = new LogicSession({
        playerOneID,
        playerTwoID,
      });

      if (moves != null) {
        logicSession.populateBoardFromMoves(moves);
      }

      return logicSession;
    } catch (error) {
      logger.error(
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

  checkForWin(board: LogicBoard, activePlayer: PlayerDTO['playerID']): boolean {
    const lastUpdatedCell = board.lastUpdatedCell;

    if (lastUpdatedCell == null) return false;

    const activePlayerHasWon = this.#validatorFuncs.some((validatorFunc) => {
      return validatorFunc(
        board.gameBoardState, // force formatting
        lastUpdatedCell.col,
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
