/* eslint-disable no-case-declarations */
import { vi } from 'vitest';

import { sharedLog } from '@connect-four-app/shared';
import { allGameSessionsMock } from '@/__mocks__/gameSessionsMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { BASE_API_SERVER_URL } from '@/constants';

const logger = sharedLog.getLogger('fetchMocks');

const originalFetch = global.fetch;

function findPlayerByUsernameAndPassword(username: string, password: string) {
  return mockPlayers.find(function (player) {
    return player.username === username && player.password === password;
  });
}

function handleGetRequest(url: string, options: RequestInit) {
  // logger.log({
  //   name: 'handleGetRequest',
  //   url,
  //   options,
  // });
  const urlObj = new URL(url);
  const gameSessionID = urlObj.pathname.replace(/^\/api\/game-sessions\//, '');

  let responseData;

  switch (url) {
    case `${BASE_API_SERVER_URL}/api/game-sessions/all`:
      responseData = {
        sessions: [...allGameSessionsMock],
      };
      break;
    case `${BASE_API_SERVER_URL}/api/game-sessions/${gameSessionID}`:
      const foundGameSession = allGameSessionsMock.find(
        (gameSession) => gameSession.id === gameSessionID,
      );

      responseData =
        foundGameSession != null
          ? {
              session: foundGameSession,
            }
          : {
              message: `[handlePostRequest] [GameSessionsController.getGameSession] : Could not find 'game-session' with ID '${gameSessionID}'.`,
              status: 404,
            };

      break;
    default:
      responseData = {
        message: `[handlePostRequest] Unhandled endpoint '${url}'`,
        statusCode: 500,
      };
  }

  const status = responseData?.statusCode || 200;

  return resolveWithResult(responseData, status);
}

function handlePostRequest(url: string, options: RequestInit) {
  const jsonBody =
    typeof options.body === 'string' // force formatting
      ? JSON.parse(options.body)
      : options.body;

  let responseData;
  let playerDetails;

  switch (url) {
    case `${BASE_API_SERVER_URL}/api/auth/register`:
      playerDetails = findPlayerByUsernameAndPassword(
        jsonBody.username,
        jsonBody.password,
      );
      if (playerDetails) {
        responseData = {
          message: 'Registration successful!',
          playerId: playerDetails.playerID,
          username: playerDetails.username,
        };
      } else {
        responseData = {
          message: 'Invalid username or password.',
          statusCode: 401,
        };
      }
      break;
    case `${BASE_API_SERVER_URL}/api/auth/login`:
      playerDetails = findPlayerByUsernameAndPassword(
        jsonBody.username,
        jsonBody.password,
      );
      if (playerDetails) {
        responseData = {
          message: 'Login successful!',
          playerId: playerDetails.playerID,
          username: playerDetails.username,
        };
      } else {
        responseData = {
          message: 'Invalid username or password.',
          statusCode: 401,
        };
      }
      break;
    default:
      responseData = {
        message: `[handlePostRequest] Unhandled endpoint '${url}'`,
        statusCode: 500,
      };
  }

  const status = responseData?.statusCode || 200;

  return resolveWithResult(responseData, status);
}

function resolveWithResult(data: unknown, status: number) {
  return Promise.resolve({
    ok: status >= 200 && status < 500,
    status: status,
    headers: {
      'Content-Type': 'application/json',
    },
    json: async () => data,
  });
}

export function createFetchMock() {
  const mockFetch = vi.fn((url: RequestInfo | URL, options?: RequestInit) => {
    // logger.log({
    //   name: 'createFetchMock - mockFetch',
    //   url,
    //   options,
    // });
    const urlString = url.toString();

    switch (options?.method) {
      // TODO: is there constant for these?
      case 'GET':
        return handleGetRequest(urlString, options);
      case 'POST':
        return handlePostRequest(urlString, options);
      default:
        return originalFetch(url, options);
    }
  });

  // vi.stubGlobal('fetch', mockFetch);
  // // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  // global.fetch = mockFetch;

  return mockFetch;
}
