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

import { PlayerMove, MAKE_MOVE, RESOLVED_MOVE } from '@/constants';
import { GameEngineService } from '@/game-engine/game-engine.service';

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

  @SubscribeMessage(MAKE_MOVE)
  async onEvent(
    @MessageBody() data: PlayerMove,
    // client: any, data: any
    // ): Promise<WsResponse<T>> {
  ): Promise<Observable<WsResponse<PlayerMove>>> {
    return new Promise((resolve) => {
      from([data])
        .pipe(
          map((item, index) => {
            this._log(
              '='.repeat(80) +
                ` [GameEventsGateway.onEvent] data item #${index}` +
                '='.repeat(80),
            );
            this._log({ item });
            this._log('='.repeat(160));
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
          );
          this._log({ results });
          this._log('='.repeat(160));
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

  _log(message: any) {
    if (this.#loggingEnabled) {
      console.log(message);
    }
  }

  get loggingEnabled(): boolean {
    return this.#loggingEnabled;
  }

  set loggingEnabled(value: boolean) {
    this.#loggingEnabled = value;
  }
}
