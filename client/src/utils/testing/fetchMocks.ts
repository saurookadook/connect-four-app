import { vi } from 'vitest';

import { allGameSessionsMock } from '@/__mocks__/gameSessionsMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { BASE_API_SERVER_URL } from '@/constants';

const originalFetch = global.fetch;

function findPlayerByUsernameAndPassword(username: string, password: string) {
  return mockPlayers.find(function (player) {
    return player.username === username && player.password === password;
  });
}

function handleGetRequest(url: string, options: RequestInit) {
  // console.log({
  //   name: 'handleGetRequest',
  //   url,
  //   options,
  // });
  let responseData;

  switch (url) {
    case `${BASE_API_SERVER_URL}/api/game-sessions/all`:
      responseData = {
        sessions: [...allGameSessionsMock],
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
      playerDetails = findPlayerByUsernameAndPassword(jsonBody.username, jsonBody.password);
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
      playerDetails = findPlayerByUsernameAndPassword(jsonBody.username, jsonBody.password);
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
    // console.log({
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
