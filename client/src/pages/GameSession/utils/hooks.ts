import { useEffect } from 'react';

import { sharedLog, type Nullable } from '@connect-four-app/shared';
import { GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { AppDispatch } from '@/store';
import { fetchGameSession, setPlayerID } from '@/store/actions';
import { RouterParams } from '@/types/main';

const logger = sharedLog.getLogger(useLoadGame.name);

/**
 * @todo Might be able to remove this hook?
 */
export function useLoadGame({
  dispatch, // force formatting
  params,
  gameSessionID,
  playerID,
}: {
  dispatch: AppDispatch;
  params: RouterParams;
  gameSessionID: string | null;
  playerID: string | null;
}) {
  useEffect(() => {
    if (playerID != null) {
      return;
    }

    // TODO: should something else happen if `playerID` is null?
    const storedPlayerDetails = window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);

    if (storedPlayerDetails != null) {
      const parsedDetails = JSON.parse(storedPlayerDetails);
      setPlayerID({ dispatch, playerID: parsedDetails.playerID });
    }
  }, [dispatch, playerID]);

  useEffect(() => {
    if (isCurrentGameSessionLoaded(gameSessionID, params)) {
      return;
    }

    if (typeof params.gameSessionID === 'string') {
      // TODO: should this just send a START_GAME event through the websocket?
      fetchGameSession({ dispatch, gameSessionID: params.gameSessionID });
    } else {
      logger.warn("Parameter 'gameSessionID' missing from params object!");
    }

    // const storedGameSession = window.localStorage.getItem(GAME_SESSION_LS_KEY);

    // if (storedGameSession != null) {
    //   const parsedDetails = JSON.parse(storedGameSession);
    //   setGameSessionID({ dispatch, gameSessionID: parsedDetails.id });
    // }
  }, [dispatch, params, gameSessionID]);
}

function isCurrentGameSessionLoaded(
  gameSessionID: Nullable<string>,
  params: RouterParams,
) {
  return (
    gameSessionID != null &&
    params.gameSessionID != null &&
    params.gameSessionID === gameSessionID
  );
}
