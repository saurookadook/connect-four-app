import { inspect } from 'node:util';
import { ws } from 'msw';

import {
  MAKE_MOVE,
  SEND_GAME_SESSION,
  SEND_MOVE,
  START_GAME,
  safeParseJSON,
  type BaseWebSocketMessageEvent,
  type PlayerID,
  type PlayerMove,
  type SendGameSessionMessageEvent,
  type SendMoveMessageEvent,
} from '@connect-four-app/shared';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import {
  findGameSessionMock,
  findGameSessionMockForPlayers,
} from './gameSessionsMocks';

const WS_CONN_URL = 'ws://localhost:8090/connect-ws';

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
      const clientEventData = safeParseJSON(event.data) as BaseWebSocketMessageEvent;
      console.log(
        `${'='.repeat(8)}  [Mock WSServer] : Processing message...  `.padEnd(
          process.stdout.columns,
          '=',
        ),
        '\n',
        // inspect(
        //   {
        //     event,
        //     clientEventData,
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

      let data: any = null;

      // TODO: make all of this more dynamic
      //    (i.e. use `gameSessionID` from `clientEventData` to find game session mock data)
      switch (clientEventData.event) {
        case START_GAME:
          event.preventDefault();
          data = createSendGameSessionData({ startGameData: clientEventData.data });
          break;
        case MAKE_MOVE:
          event.preventDefault();
          data = createSendMoveData({ playerMoveData: clientEventData.data });
          break;
        default:
          console.log(
            `${'='.repeat(8)}  [Mock WSServer] : No matching event for event '${clientEventData.event}'`,
          );
      }

      wsApi.clients.forEach((client) => {
        client.send(JSON.stringify(data));
      });
    });
  }),
];

type StartGameEventData = {
  gameSessionID: string;
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
};

function createSendGameSessionData({
  startGameData, // force formatting
}: {
  startGameData: StartGameEventData;
}): SendGameSessionMessageEvent<{
  playerOneUsername?: string;
  playerTwoUsername?: string;
}> {
  const { gameSessionID, playerOneID, playerTwoID } = startGameData;

  const mockGameSession = findGameSessionMockForPlayers({
    gameSessionID,
    playerOneID,
    playerTwoID,
  });

  if (mockGameSession == null) {
    throw new Error(
      `No mock game session found for:\n ---- 'gameSessionID': '${gameSessionID}'\n ---- 'playerOneID': '${playerOneID}'\n ---- 'playerTwoID': '${playerTwoID}'`,
    );
  }

  return {
    event: SEND_GAME_SESSION,
    data: {
      id: mockGameSession.id,
      // TODO: should populate `boardCells` from `mockGameSession.moves`
      boardCells: emptyBoard,
      moves: mockGameSession.moves,
      playerOneID: mockGameSession.playerOneID,
      playerOneUsername: mockGameSession.playerOneUsername,
      playerTwoID: mockGameSession.playerTwoID,
      playerTwoUsername: mockGameSession.playerTwoUsername,
      status: mockGameSession.status,
      winner: null,
    },
  };
}

function createSendMoveData({
  playerMoveData, // force formatting
}: {
  playerMoveData: PlayerMove;
}): SendMoveMessageEvent<{
  playerOneUsername?: string;
  playerTwoUsername?: string;
}> {
  const { gameSessionID, playerID } = playerMoveData;

  const mockGameSession = findGameSessionMock({
    gameSessionID,
    playerID,
  });

  if (mockGameSession == null) {
    throw new Error(
      `No mock game session found for:\n ---- 'gameSessionID': '${gameSessionID}'\n ---- 'playerID': '${playerID}'`,
    );
  }

  return {
    event: SEND_MOVE,
    data: {
      id: mockGameSession.id,
      // TODO: should populate `boardCells` from `mockGameSession.moves`
      boardCells: emptyBoard,
      moves: [...mockGameSession.moves, playerMoveData],
      playerOneID: mockGameSession.playerOneID,
      playerOneUsername: mockGameSession.playerOneUsername,
      playerTwoID: mockGameSession.playerTwoID,
      playerTwoUsername: mockGameSession.playerTwoUsername,
      status: mockGameSession.status,
      // TODO: should assign winner for winning move
      winner: null,
    },
  };
}
