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
  sharedLog,
  type PlayerID,
  type PlayerMove,
  type SendGameSessionMessageEvent,
  type SendMoveMessageEvent,
} from '@connect-four-app/shared';
import { GameEngineService } from '../game-engine.service';

const logger = sharedLog.getLogger('GameEventsGateway');

// TODO: better way to handle this?
const WS_PORT = parseInt(process.env.WS_PORT || '8090', 10);

export type GameSessionMap = Map<string, WebSocket>;

@Injectable()
@WebSocketGateway(WS_PORT)
export class GameEventsGateway implements OnGatewayConnection {
  // TODO: this should probably live in a shared constant
  #BASE_WS_CONNECTION_URL: string = 'ws://localhost:8090';
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

  @SubscribeMessage(START_GAME)
  async onStartGame(
    @MessageBody()
    data: {
      gameSessionID?: string;
      playerOneID: PlayerID;
      playerTwoID: PlayerID;
    },
  ) {
    const { boardState, gameSession } = await this.gameEngineService.startGame({
      gameSessionID: data.gameSessionID,
      playerOneID: data.playerOneID,
      playerTwoID: data.playerTwoID,
    });

    const activeGame = this.#activeGamesMap.get(
      gameSession.id,
    ) as GameSessionMap;

    const sendGameSessionMessageEvent: SendGameSessionMessageEvent = {
      event: SEND_GAME_SESSION,
      data: {
        id: gameSession.id,
        boardCells: boardState.cells,
        moves: gameSession.moves,
        playerOneID: gameSession.playerOne.playerID,
        playerOneUsername: gameSession.playerOne.username,
        playerTwoID: gameSession.playerTwo.playerID,
        playerTwoUsername: gameSession.playerTwo.username,
        status: gameSession.status,
        winner: gameSession.winner,
      },
    };

    activeGame.forEach((client) => {
      client.send(JSON.stringify(sendGameSessionMessageEvent));
    });
  }

  @SubscribeMessage(MAKE_MOVE)
  async onMakeMove(
    @MessageBody() data: PlayerMove, // force formatting
  ): Promise<void> {
    const { boardState, gameSession } =
      await this.gameEngineService.handlePlayerMove(data);

    const activeGame = this.#activeGamesMap.get(
      gameSession.id,
    ) as GameSessionMap;
    const sendMoveMessageEvent: SendMoveMessageEvent = {
      event: SEND_MOVE,
      data: {
        id: gameSession.id,
        boardCells: boardState.cells,
        moves: gameSession.moves,
        playerOneID: gameSession.playerOne.playerID,
        playerOneUsername: gameSession.playerOne.username,
        playerTwoID: gameSession.playerTwo.playerID,
        playerTwoUsername: gameSession.playerTwo.username,
        status: gameSession.status,
        winner: gameSession.winner,
      },
    };

    activeGame.forEach((client) => {
      client.send(JSON.stringify(sendMoveMessageEvent));
    });
  }

  get activeGamesMap(): Map<string, GameSessionMap> {
    return this.#activeGamesMap;
  }

  // TODO: just temp for testing with frontend
  @SubscribeMessage('broadcast-test')
  onBroadcastTestEvent(@MessageBody('message') message: string) {
    this._logDebug(
      {
        headerMessage: `[${this.onBroadcastTestEvent.name}] Message received: '${message}'`,
      },
      inspect(
        { clients: this.server.clients },
        { colors: true, compact: false, depth: 1, showHidden: true },
      ),
    );

    this.server.clients.forEach((client, socket, wsSet) => {
      this._logDebug(
        {
          delimiter: '?',
          headerMessage: `[${this.onBroadcastTestEvent.name}] 'clients.forEach' callback`,
        },
        inspect(
          { client, socket, wsSet },
          { colors: true, compact: false, depth: 1, showHidden: true },
        ),
      );

      if (client.readyState === WebSocket.OPEN) {
        client.send('[server] Hello, world!');
      }
    });
  }

  /**
   * @description Purely to clean up some of the `logger.debug` calls
   */
  _logDebug(
    {
      delimiter = '=',
      headerMessage,
    }: { delimiter?: string; headerMessage: string },
    ...args: any[]
  ) {
    const argsWithSpacers = args.reduce((acc, cur, index) => {
      if (index === 0) {
        acc.push(cur);
      } else {
        acc.push('\n', cur);
      }

      return acc;
    }, []);

    logger.debug(
      delimiter.repeat(160),
      '\n',
      `    ${headerMessage}`,
      '\n',
      ...argsWithSpacers,
      '\n',
      delimiter.repeat(160),
    );
  }
}
