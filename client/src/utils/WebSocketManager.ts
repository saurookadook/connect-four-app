import {
  safeParseJSON, // force formatting
  sharedLog,
  type Nullable,
} from '@connect-four-app/shared';

const logger = sharedLog.getLogger('WebSocketManager');

class WebSocketManager {
  #BASE_WS_CONNECTION_URL: string | URL;
  #gameSessionID: string;
  #playerID: string;
  #ws: Nullable<WebSocket>;

  constructor(connectionURL: string | URL = 'ws://localhost:8090/connect-ws') {
    this.#BASE_WS_CONNECTION_URL = connectionURL;
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
        logger.log(
          '    [WebSocket] Opening WebSocket connection    '
            .padStart(60, '-')
            .padEnd(120, '-'),
          '\n',
          { event },
          '\n',
        );
      });

      wsConn.addEventListener('message', (event) => {
        logger.log(
          '    [WebSocket] Receiving message!     '.padStart(60, '-').padEnd(120, '-'),
          '\n',
          { event, eventData: safeParseJSON(event.data) },
          '\n',
        );
      });
    } catch (error: unknown) {
      logger.error('ERROR creating WebSocket instance', error);
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
      logger.log(
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

export { WebSocketManager };
export default wsManager;
