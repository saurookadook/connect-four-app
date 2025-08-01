import { sharedLog, type PlayerID } from '@connect-four-app/shared';
import { BASE_API_SERVER_URL, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { BoundThis, type BaseAction } from '@/types/main';
import { safeFetch } from '@/utils';
import {
  REGISTER_NEW_PLAYER,
  LOG_IN_PLAYER,
  SET_PLAYER_ID,
  UNSET_PLAYER_INFO,
} from '../actionTypes';

const logger = sharedLog.getLogger('playerActions');

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
        response.statusText ||
          `Unknown error handling auth request to '${requestPath}'`,
      );
    }

    responseData = await response.json();
  } catch (error) {
    logger.error(errorMessage, error);
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

export async function logOutPlayer({
  dispatch, // force formatting
  playerID,
}: BaseAction & { playerID: PlayerID }) {
  const responseData = await safeFetch.call(
    {
      name: logOutPlayer.name,
    },
    {
      requestPathname: `/api/auth/logout/${playerID}`,
      fetchOpts: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
      },
    },
  );

  logger.debug(`[${logOutPlayer.name}] responseData:`, {
    responseData,
  });

  if (responseData !== 'Accepted') {
    // TODO: throw error?
  }

  window.localStorage.removeItem(PLAYER_DETAILS_LS_KEY);

  return unsetPlayer({
    dispatch,
  });
}

export function setPlayerID({
  dispatch, // force formatting
  playerID,
}: BaseAction & { playerID: PlayerID }) {
  return dispatch({
    type: SET_PLAYER_ID,
    payload: {
      playerID: playerID,
    },
  });
}

export function unsetPlayer({
  dispatch, // force formatting
}: BaseAction) {
  return dispatch({
    type: UNSET_PLAYER_INFO,
  });
}
