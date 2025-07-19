import { UUID } from 'node:crypto';
import * as uuid from 'uuid';

import { PlayerDTO } from '@/player/dtos/player.dto';
import { GameBoard, GameSessionStatus, PlayerColor } from './constants';
import { LogicBoard } from './';

type PlayerID = PlayerDTO['playerID'];

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

  // TODO: maybe this is unnecessary?
  updateBoard({
    column, // force formatting
    playerID,
  }: {
    column: number;
    playerID: UUID;
  }): GameBoard {
    return this.#board.updateBoardState({
      columnIndex: column,
      playerID: playerID,
    });
  }

  getPlayerColorByID(playerID: UUID): PlayerColor {
    switch (playerID) {
      case this.#playerOneID:
        return PlayerColor.RED;
      case this.#playerTwoID:
        return PlayerColor.BLACK;
      default:
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

  get playerOneID(): UUID {
    return this.#playerOneID;
  }

  set playerOneID(playerID: UUID) {
    if (!uuid.validate(playerID)) {
      throw new TypeError(`Invalid argument: 'playerID' must be a valid UUID`);
    }

    this.#playerOneID = playerID;
  }

  get playerTwoID(): UUID {
    return this.#playerTwoID;
  }

  set playerTwoID(playerID: UUID) {
    if (!uuid.validate(playerID)) {
      throw new TypeError(`Invalid argument: 'playerID' must be a valid UUID`);
    }

    this.#playerTwoID = playerID;
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
