let ws: WebSocket;

// see proxy settings in vite.config.ts
const WS_CONNECTION_URL = 'ws://localhost:8090/connect-ws';

try {
  ws = new WebSocket(WS_CONNECTION_URL);

  ws.addEventListener('open', (event) => {
    console.log(
      '    [WebSocket] Opening WebSocket connection    '.padStart(60, '-').padEnd(120, '-'),
    );
    console.log('\n');
    console.log({ event });
    console.log('\n');
  });

  ws.addEventListener('message', (event) => {
    console.log('    [WebSocket] Receiving message!     '.padStart(60, '-').padEnd(120, '-'));
    console.log('\n');
    console.log({ event });
    console.log('\n');
  });
} catch (error: unknown) {
  console.error('ERROR creating WebSocket instance', error);
}

const openWSConn = () => {
  if (ws == null) {
    ws = new WebSocket(WS_CONNECTION_URL);
  }
  return ws;
};

const closeWSConn = () => {
  if (ws != null && (ws.readyState === ws.OPEN || ws.readyState === ws.CONNECTING)) {
    console.log(
      '    [WebSocket] Closing WebSocket connection    '.padStart(60, '-').padEnd(120, '-'),
    );
    ws.close();
    // @ts-expect-error: This is on purpose :]
    ws = null;
  }
};

export { ws, openWSConn, closeWSConn };
export * from './deeplyMerge';
export * from './typeGuards';
