import * as uuid from 'uuid';

import type { PlayerID } from '@/types/main';
import { GameBoard, GameSessionStatus, PlayerColor } from './constants';
import { LogicBoard } from './';

export class LogicSession {
  #activePlayer: PlayerID;
  #board: LogicBoard;
  // players: UUID[]; // TODO: maybe this would be simpler...?
  #playerOneID: PlayerID;
  #playerTwoID: PlayerID;
  #status: GameSessionStatus;

  constructor({
    activePlayer, // force formatting
    boardState,
    playerOneID,
    playerTwoID,
    status,
  }: {
    activePlayer?: PlayerID;
    boardState?: GameBoard;
    playerOneID: PlayerID;
    playerTwoID: PlayerID;
    status?: GameSessionStatus;
  }) {
    this.#activePlayer = activePlayer ?? playerOneID;
    this.#board = new LogicBoard({ gameBoardState: boardState });
    this.#playerOneID = playerOneID;
    this.#playerTwoID = playerTwoID;
    this.#status = status ?? GameSessionStatus.ACTIVE;
  }

  changeActivePlayer() {
    this.#activePlayer =
      this.#activePlayer === this.#playerOneID
        ? this.#playerTwoID
        : this.#playerOneID;
  }

  updateBoard({
    column, // force formatting
    playerID,
  }: {
    column: number;
    playerID: PlayerID;
  }): GameBoard {
    this.validatePlayerID(playerID);

    return this.#board.updateBoardState({
      columnIndex: column,
      playerID: playerID,
    });
  }

  getPlayerColorByID(playerID: PlayerID): PlayerColor {
    switch (playerID) {
      case this.#playerOneID:
        return PlayerColor.RED;
      case this.#playerTwoID:
        return PlayerColor.BLACK;
      default:
        throw new Error(`Unknown player color for playerID: '${playerID}'`);
    }
  }

  validatePlayerID(playerID: PlayerID) {
    if (playerID !== this.#playerOneID && playerID !== this.#playerTwoID) {
      throw new Error(`Unknown playerID: '${playerID}'`);
    }
  }

  get activePlayer(): PlayerID {
    return this.#activePlayer;
  }

  set activePlayer(playerID: unknown) {
    // TODO: should use `isUUID` type guard
    if (typeof playerID !== 'string' || !playerID) {
      throw new Error(
        `Invalid player ID: '${String(playerID)}' (type '${typeof playerID}')`,
      );
    }

    this.#activePlayer = playerID as PlayerID;
  }

  get board(): LogicBoard {
    return this.#board;
  }

  set board(boardValue: LogicBoard) {
    if (!(boardValue instanceof LogicBoard)) {
      throw new TypeError(
        `Invalid argument: 'board' must be an instance of 'LogicBoard'`,
      );
    }

    this.#board = boardValue;
  }

  get playerOneID(): PlayerID {
    return this.#playerOneID;
  }

  set playerOneID(playerID: unknown) {
    if (!uuid.validate(playerID)) {
      throw new TypeError(`Invalid argument: 'playerID' must be a valid UUID`);
    }

    this.#playerOneID = playerID as PlayerID;
  }

  get playerTwoID(): PlayerID {
    return this.#playerTwoID;
  }

  set playerTwoID(playerID: unknown) {
    if (!uuid.validate(playerID)) {
      throw new TypeError(`Invalid argument: 'playerID' must be a valid UUID`);
    }

    this.#playerTwoID = playerID as PlayerID;
  }

  get status(): GameSessionStatus {
    return this.#status;
  }

  set status(statusValue: GameSessionStatus) {
    if (!(statusValue in GameSessionStatus)) {
      throw new TypeError(
        `Invalid status: argument must be a member of 'GameSessionStatus'`,
      );
    }

    this.#status = statusValue;
  }
}
