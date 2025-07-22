import { type IncomingMessage } from 'node:http';
import { inspect } from 'node:util';
import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';

import {
  MAKE_MOVE,
  RESOLVED_MOVE,
  SEND_MOVE,
  START_GAME,
  SEND_GAME_SESSION,
  type PlayerID,
  type PlayerMove,
} from '@connect-four-app/shared';
import { GameEngineService } from '../game-engine.service';

// TODO: better way to handle this?
const WS_PORT = parseInt(process.env.WS_PORT || '8090', 10);

export type GameSessionMap = Map<string, WebSocket>;

@Injectable()
@WebSocketGateway(WS_PORT)
export class GameEventsGateway implements OnGatewayConnection {
  // TODO: this should probably live in a shared constant
  #BASE_WS_CONNECTION_URL: string = 'ws://localhost:8090';
  #loggingEnabled = true;
  #activeGamesMap = new Map<string, GameSessionMap>();

  constructor(private readonly gameEngineService: GameEngineService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket, incomingMessage: IncomingMessage) {
    const incomingURL = new URL(
      incomingMessage.url as string,
      this.#BASE_WS_CONNECTION_URL,
    );
    const incomingGameSessionID = incomingURL.searchParams.get('gsID');
    const incomingPlayerID = incomingURL.searchParams.get('pID');

    if (
      typeof incomingGameSessionID !== 'string' ||
      typeof incomingPlayerID !== 'string'
    ) {
      // TODO: fix type of error
      throw new Error(
        `Invalid connection params!!!!!!!!!        incomingGameSessionID: ${incomingGameSessionID} || incomingPlayerID: ${incomingPlayerID}`,
      );
    }

    if (!this.#activeGamesMap.has(incomingGameSessionID)) {
      this.#activeGamesMap.set(incomingGameSessionID, new Map());
    }

    const activeGame = this.#activeGamesMap.get(
      incomingGameSessionID,
    ) as GameSessionMap;
    activeGame.set(incomingPlayerID, client);
  }

  // TODO: just temp for testing with frontend
  @SubscribeMessage('broadcast-test')
  onBroadcastTestEvent(@MessageBody('message') message: string) {
    this._log(
      '='.repeat(160),
      '\n',
      `    [GameEventsGateway.onTestEvent] Message received: '${message}'`,
      '\n',
      inspect(
        { clients: this.server.clients },
        { colors: true, compact: false, depth: 1, showHidden: true },
      ),
      '\n',
      '='.repeat(160),
    );

    this.server.clients.forEach((client, socket, wsSet) => {
      this._log(
        '?'.repeat(160),
        '\n',
        `    [GameEventsGateway.onTestEvent] 'clients.forEach' callback`,
        '\n',
        inspect(
          { client, socket, wsSet },
          { colors: true, compact: false, depth: 1, showHidden: true },
        ),
        '\n',
        '?'.repeat(160),
      );
      if (client.readyState === WebSocket.OPEN) {
        client.send('[server] Hello, world!');
      }
    });
  }

  @SubscribeMessage(START_GAME)
  async onStartGame(
    @MessageBody()
    data: {
      gameSessionID?: string;
      playerOneID: PlayerID;
      playerTwoID: PlayerID;
    },
  ) {
    this._log(
      '='.repeat(160),
      '\n',
      `    [GameEventsGateway.onStartGame] : 'data' received:`,
      '\n',
      { data },
      '\n',
      '='.repeat(160),
    );

    const { boardState, gameSession } = await this.gameEngineService.startGame({
      gameSessionID: data.gameSessionID,
      playerOneID: data.playerOneID,
      playerTwoID: data.playerTwoID,
    });

    const activeGame = this.#activeGamesMap.get(
      gameSession.id,
    ) as GameSessionMap;

    activeGame.forEach((client) => {
      client.send(
        JSON.stringify({
          event: SEND_GAME_SESSION,
          data: {
            id: gameSession.id,
            boardCells: boardState.cells,
            moves: gameSession.moves,
            playerOneID: gameSession.playerOneID,
            playerTwoID: gameSession.playerTwoID,
            status: gameSession.status,
          },
        }),
      );
    });
  }

  @SubscribeMessage(MAKE_MOVE)
  async onMakeMove(
    @MessageBody() data: PlayerMove, // force formatting
  ): Promise<void> {
    this._log(
      '='.repeat(160),
      '\n',
      `    [GameEventsGateway.onEvent] 'data' received:`,
      '\n',
      { ...data },
      '\n',
      '='.repeat(160),
    );

    const { boardState, gameSession } =
      await this.gameEngineService.handlePlayerMove(data);

    const activeGame = this.#activeGamesMap.get(
      gameSession.id,
    ) as GameSessionMap;

    activeGame.forEach((client) => {
      client.send(
        JSON.stringify({
          event: SEND_MOVE,
          data: {
            id: gameSession.id,
            boardCells: boardState.cells,
            moves: gameSession.moves,
            playerOneID: gameSession.playerOneID,
            playerTwoID: gameSession.playerTwoID,
            status: gameSession.status,
          },
        }),
      );
    });
  }

  _log(...args: any) {
    if (this.#loggingEnabled) {
      console.log(...args);
    }
  }

  get loggingEnabled(): boolean {
    return this.#loggingEnabled;
  }

  set loggingEnabled(value: boolean) {
    this.#loggingEnabled = value;
  }

  get activeGamesMap(): Map<string, GameSessionMap> {
    return this.#activeGamesMap;
  }
}
