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

@WebSocketGateway(8090)
export class GameEventsGateway {
  #loggingEnabled = false;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('move')
  async onEvent<T>(
    @MessageBody() data: T,
    // client: any, data: any
    // ): Promise<WsResponse<T>> {
  ): Promise<Observable<WsResponse<T>>> {
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
                event: 'resolved-move',
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
