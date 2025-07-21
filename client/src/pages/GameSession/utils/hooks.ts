import { useEffect } from 'react';

import type { Nullable } from '@connect-four-app/shared';
import { GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { AppDispatch } from '@/store';
import { fetchGameSession, setPlayerID } from '@/store/actions';
import { RouterParams } from '@/types/main';

/**
 * @todo Should create a LOAD_GAME action type that will update
 * both state slices accordingly
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

    console.log({
      name: 'loadGame',
      params,
    });

    if (typeof params.gameSessionID === 'string') {
      fetchGameSession({ dispatch, gameSessionID: params.gameSessionID });
    } else {
      console.warn("Parameter 'gameSessionID' missing from params object!");
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
