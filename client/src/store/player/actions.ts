import { BASE_API_SERVER_URL } from '@/constants';
import { PLAYER_DETAILS_LS_KEY } from '@/pages/ConnectFour/constants';
import type { BaseAction } from '@/types/main';
import { REGISTER_NEW_PLAYER, LOG_IN_PLAYER } from '../actionTypes';

type AuthResponseData = {
  message: string;
  playerID?: string;
  playerObjectID?: string;
  statusCode: number;
  username?: string;
};

function updateBrowserSession(responseData: AuthResponseData) {
  // TMP: using localStorage until api supports session-based auth
  const isSuccess = [
    responseData.playerID,
    responseData.playerObjectID,
    responseData.username,
  ].every((n) => n != null);

  if (isSuccess) {
    const stringifiedDetails = JSON.stringify({
      playerID: responseData.playerID,
      playerObjectID: responseData.playerObjectID,
      username: responseData.username,
    });
    window.localStorage.setItem(PLAYER_DETAILS_LS_KEY, stringifiedDetails);
  }
}

async function handleAuthRequest({
  dispatch,
  actionType,
  playerDetails,
}: BaseAction & {
  actionType: typeof REGISTER_NEW_PLAYER | typeof LOG_IN_PLAYER;
  playerDetails: { username: string; password: string };
}): Promise<AuthResponseData> {
  const { errorMessage, requestPath } = (function () {
    if (actionType === REGISTER_NEW_PLAYER) {
      return {
        requestPath: '/api/auth/register',
        errorMessage: 'Encountered ERROR while registering new player:',
      };
    } else if (actionType === LOG_IN_PLAYER) {
      return {
        requestPath: '/api/auth/login',
        errorMessage: 'Encountered ERROR while logging in:',
      };
    } else {
      throw new Error('Invalid action type provided');
    }
  })();

  let responseData;

  try {
    const requestURL = new URL(requestPath, BASE_API_SERVER_URL);
    const response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify({
        username: playerDetails.username,
        password: playerDetails.password,
      }),
    });

    if (!response.ok) {
      throw new Error(
        response.statusText || `Unkonwn error handling auth request to '${requestPath}'`,
      );
    }

    responseData = await response.json();
  } catch (error) {
    console.error(errorMessage, error);
    responseData = {
      error,
      message: errorMessage,
      statusCode: 400,
    };
  }

  updateBrowserSession(responseData);

  dispatch({
    type: actionType,
    payload: {
      ...responseData,
    },
  });

  return responseData;
}

export async function registerNewPlayer({
  dispatch,
  username,
  password,
}: BaseAction & {
  username: string;
  password: string;
}) {
  return await handleAuthRequest({
    dispatch,
    actionType: REGISTER_NEW_PLAYER,
    playerDetails: { username, password },
  });
}

export async function logInPlayer({
  dispatch,
  username,
  password,
}: BaseAction & {
  username: string;
  password: string;
}) {
  return await handleAuthRequest({
    dispatch,
    actionType: LOG_IN_PLAYER,
    playerDetails: { username, password },
  });
}
