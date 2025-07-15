// TODO: move to `common` workspace
type Nullable<T> = T | null;

class WebSocketManager {
  #BASE_WS_CONNECTION_URL: string | URL;
  #gameSessionID: string;
  #playerID: string;
  #ws: Nullable<WebSocket>;

  constructor(connectionURL?: string | URL) {
    this.#BASE_WS_CONNECTION_URL = connectionURL ?? 'ws://localhost:8090/connect-ws';
    this.#playerID = '';
    this.#gameSessionID = '';
    this.#ws = null;
  }

  initializeConnection({
    gameSessionID,
    playerID,
  }: {
    gameSessionID: string;
    playerID: string;
  }): WebSocketManager {
    this.#gameSessionID = gameSessionID;
    this.#playerID = playerID;

    try {
      const wsConn = this.getOpenWSConn();

      wsConn.addEventListener('open', (event) => {
        console.log(
          '    [WebSocket] Opening WebSocket connection    '
            .padStart(60, '-')
            .padEnd(120, '-'),
        );
        console.log('\n');
        console.log({ event });
        console.log('\n');
      });

      wsConn.addEventListener('message', (event) => {
        console.log(
          '    [WebSocket] Receiving message!     '.padStart(60, '-').padEnd(120, '-'),
        );
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
      const connURL = new URL(this.#BASE_WS_CONNECTION_URL);
      connURL.searchParams.append('gsID', this.#gameSessionID);
      connURL.searchParams.append('pID', this.#playerID);

      this.#ws = new WebSocket(connURL);
    }
    return this.#ws;
  }

  closeWSConn() {
    if (
      this.#ws != null &&
      (this.#ws.readyState === this.#ws.OPEN ||
        this.#ws.readyState === this.#ws.CONNECTING)
    ) {
      console.log(
        '    [WebSocket] Closing WebSocket connection    '
          .padStart(60, '-')
          .padEnd(120, '-'),
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
export * from './safeFetch';
export * from './safeParseJson';
export * from './typeGuards';
