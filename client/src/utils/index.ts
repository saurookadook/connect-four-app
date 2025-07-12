// TODO: move to `common` workspace
type Nullable<T> = T | null;

class WebSocketManager {
  #WS_CONNECTION_URL: string | URL;
  #ws: Nullable<WebSocket>;

  constructor(connectionURL?: string | URL) {
    this.#WS_CONNECTION_URL = connectionURL ?? 'ws://localhost:8090/connect-ws';
    this.#ws = null;
  }

  initializeConnection(): WebSocketManager {
    try {
      const wsConn = this.getOpenWSConn();

      wsConn.addEventListener('open', (event) => {
        console.log(
          '    [WebSocket] Opening WebSocket connection    '.padStart(60, '-').padEnd(120, '-'),
        );
        console.log('\n');
        console.log({ event });
        console.log('\n');
      });

      wsConn.addEventListener('message', (event) => {
        console.log('    [WebSocket] Receiving message!     '.padStart(60, '-').padEnd(120, '-'));
        console.log('\n');
        console.log({ event });
        console.log('\n');
      });
    } catch (error: unknown) {
      console.error('ERROR creating WebSocket instance', error);
    }

    return this;
  }

  getOpenWSConn(): WebSocket {
    if (this.#ws == null) {
      this.#ws = new WebSocket(this.#WS_CONNECTION_URL);
    }
    return this.#ws;
  }

  closeWSConn() {
    if (
      this.#ws != null &&
      (this.#ws.readyState === this.#ws.OPEN || this.#ws.readyState === this.#ws.CONNECTING)
    ) {
      console.log(
        '    [WebSocket] Closing WebSocket connection    '.padStart(60, '-').padEnd(120, '-'),
      );
      this.#ws.close();
      this.#ws = null;
    }
  }

  get ws(): Nullable<WebSocket> {
    return this.#ws;
  }
}

const wsManager = new WebSocketManager();

export { wsManager };
export * from './deeplyMerge';
export * from './typeGuards';
