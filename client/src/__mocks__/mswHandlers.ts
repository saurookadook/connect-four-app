import { inspect } from 'node:util';
import { ws } from 'msw';

import {
  MAKE_MOVE,
  SEND_GAME_SESSION,
  SEND_MOVE,
  START_GAME,
  safeParseJSON,
  type BaseWebSocketMessageEvent,
} from '@connect-four-app/shared';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { allGameSessionsMock, GameSessionMock } from './gameSessionsMocks';
import { mockFirstPlayer, mockSecondPlayer } from './playerMocks';

const WS_CONN_URL = 'ws://localhost:8090/connect-ws';

const mockGameSession = allGameSessionsMock.find((gameSession) => {
  return (
    gameSession.playerOneID === mockFirstPlayer.playerID &&
    gameSession.playerTwoID === mockSecondPlayer.playerID
  );
}) as GameSessionMock;
const emptyBoard = createEmptyBoard();

const wsApi = ws.link(WS_CONN_URL);

export const handlers = [
  wsApi.addEventListener('connection', ({ client, server }) => {
    console.log(
      `${'='.repeat(8)}  [Mock WSServer] : Opening server connection...   `.padEnd(
        process.stdout.columns,
        '=',
      ),
    );

    client.addEventListener('message', (event) => {
      const messageData = safeParseJSON(event.data) as BaseWebSocketMessageEvent;
      console.log(
        `${'='.repeat(8)}  [Mock WSServer] : Processing message...  `.padEnd(
          process.stdout.columns,
          '=',
        ),
        '\n',
        // inspect(
        //   {
        //     event,
        //     messageData,
        //   },
        //   {
        //     colors: true,
        //     compact: false,
        //     depth: 2,
        //     showHidden: true,
        //     sorted: true,
        //   },
        // ),
      );

      let data = '';

      switch (messageData.event) {
        case START_GAME:
          event.preventDefault();
          data = JSON.stringify({
            event: SEND_GAME_SESSION,
            data: {
              id: mockGameSession.id,
              boardCells: emptyBoard,
              moves: mockGameSession.moves,
              playerOneID: mockGameSession.playerOneID,
              playerTwoID: mockGameSession.playerTwoID,
              status: mockGameSession.status,
            },
          });
          break;
        case MAKE_MOVE:
          event.preventDefault();
          data = JSON.stringify({
            event: SEND_MOVE,
            data: {
              id: mockGameSession.id,
              boardCells: emptyBoard,
              moves: mockGameSession.moves,
              playerOneID: mockGameSession.playerOneID,
              playerTwoID: mockGameSession.playerTwoID,
              status: mockGameSession.status,
            },
          });
          break;
        default:
          console.log(
            `${'='.repeat(8)}  [Mock WSServer] : No matching event for event '${messageData.event}'`,
          );
      }

      wsApi.clients.forEach((client) => {
        client.send(data);
      });
    });
  }),
];
