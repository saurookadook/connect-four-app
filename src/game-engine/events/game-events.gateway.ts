import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

import {
  PlayerMove,
  MAKE_MOVE,
  RESOLVED_MOVE,
  START_GAME,
  SEND_GAME_SESSION,
} from '@/constants';
import { GameEngineService } from '../game-engine.service';

@Injectable()
@WebSocketGateway(8090)
export class GameEventsGateway {
  #loggingEnabled = false;

  constructor(private readonly gameEngineService: GameEngineService) {}

  @WebSocketServer()
  server: Server;

  // TODO: just temp for testing with frontend
  @SubscribeMessage('health-check')
  onTestEvent(@MessageBody('message') message: string) {
    console.log(
      '='.repeat(160),
      '\n',
      `    [GameEventsGateway.onTestEvent] Message received: '${message}'`,
      '\n',
      '='.repeat(160),
    );

    return '[server] Hello, world!';
  }

  @SubscribeMessage(START_GAME)
  async onStartGame(
    @MessageBody()
    data: {
      gameSessionId?: string;
      playerOneID: UUID;
      playerTwoID: UUID;
    },
  ) {
    this._log(
      '='.repeat(160),
      '\n',
      `    [GameEventsGateway.onEvent] 'data' received:`,
      '\n',
      { data },
      '\n',
      '='.repeat(160),
    );

    const newGameSession = await this.gameEngineService.startGame({
      playerOneID: data.playerOneID,
      playerTwoID: data.playerTwoID,
    });

    return {
      event: SEND_GAME_SESSION,
      data: {
        id: newGameSession.id,
        moves: newGameSession.moves,
        playerOneID: newGameSession.playerOneID,
        playerTwoID: newGameSession.playerTwoID,
        status: newGameSession.status,
      },
    };
  }

  @SubscribeMessage(MAKE_MOVE)
  async onEvent(
    @MessageBody() data: PlayerMove,
    // client: any, data: any
    // ): Promise<WsResponse<T>> {
  ): Promise<Observable<WsResponse<PlayerMove>>> {
    this._log(
      '='.repeat(160),
      '\n',
      `    [GameEventsGateway.onEvent] 'data' received:`,
      '\n',
      { data },
      '\n',
      '='.repeat(160),
    );

    return new Promise((resolve) => {
      from([data])
        .pipe(
          map((item, index) => {
            this._log(
              '='.repeat(160),
              '\n',
              `    [GameEventsGateway.onEvent] data item #${index}`,
              '\n',
              { item },
              '\n',
              '='.repeat(160),
            );
            return {
              event: 'move',
              data: item,
            };
          }),
        )
        .subscribe((results) => {
          this._log(
            '='.repeat(80) +
              ' [GameEventsGateway.onEvent] results ' +
              '='.repeat(80),
            '\n',
            { results },
            '\n',
            '='.repeat(160),
          );
          resolve(
            from([
              {
                event: RESOLVED_MOVE,
                data: results.data,
              },
            ]),
          );
        });
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
}
