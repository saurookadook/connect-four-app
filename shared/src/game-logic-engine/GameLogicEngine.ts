import { inspect } from 'node:util';

import {
  GameSessionStatus, // force formatting
  PlayerColor,
} from '@/constants';
import { log as sharedLog } from '@/logger';
import {
  type PlayerID, // force formatting
  type PlayerMove,
} from '@/types/main';
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
    playerOneID: PlayerID;
    playerTwoID: PlayerID;
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
    playerID: PlayerID;
    sessionRef: LogicSession;
  }): LogicSession {
    sessionRef.updateBoard({
      column: columnIndex,
      playerID: playerID,
    });

    if (this.checkForWin(sessionRef.board)) {
      return this.endGame(sessionRef);
    }

    sessionRef.changeActivePlayer();

    return sessionRef;
  }

  checkForWin(board: LogicBoard): boolean {
    const lastUpdatedCell = board.lastUpdatedCell;

    if (lastUpdatedCell == null) return false;

    logger.debug(' lastUpdatedCell:\n', { lastUpdatedCell });

    const activePlayerHasWon = this.#validatorFuncs.some((validatorFunc) => {
      return validatorFunc(
        board.gameBoardState, // force formatting
        lastUpdatedCell.col,
        lastUpdatedCell.row,
        lastUpdatedCell.cellState as PlayerID,
      );
    });

    logger.debug(
      `'checkForWin' result for '${lastUpdatedCell.cellState}': ${activePlayerHasWon}`,
    );
    return activePlayerHasWon;
  }

  endGame(sessionRef: LogicSession) {
    sessionRef.status = GameSessionStatus.COMPLETED;
    logger.debug(
      `[${this.endGame.name} method] ${'-'.repeat(120)}\n`,
      inspect({
        activePlayer: sessionRef.activePlayer,
        boardCells: sessionRef.board.gameBoardState,
        playerOneID: sessionRef.playerOneID,
        playerTwoID: sessionRef.playerTwoID,
      }),
    );

    return sessionRef;
  }
}
