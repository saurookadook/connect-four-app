import { useEffect } from 'react';

import { AppDispatch } from '@/store';
import { setGameSessionID, setPlayerID } from '@/store/actions';
import { GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '../constants';

/**
 * @todo Should create a LOAD_GAME action type that will update
 * both state slices accordingly
 */
export function useLoadGame({
  dispatch, // force formatting
  gameSessionID,
  playerID,
}: {
  dispatch: AppDispatch;
  gameSessionID: string | null;
  playerID: string | null;
}) {
  useEffect(() => {
    if (playerID != null) {
      return;
    }

    const storedPlayerDetails = window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);

    if (storedPlayerDetails != null) {
      const parsedDetails = JSON.parse(storedPlayerDetails);
      setPlayerID({ dispatch, playerID: parsedDetails.playerID });
    }
  }, [dispatch, playerID]);

  useEffect(() => {
    if (gameSessionID != null) {
      return;
    }

    const storedGameSession = window.localStorage.getItem(GAME_SESSION_LS_KEY);

    if (storedGameSession != null) {
      const parsedDetails = JSON.parse(storedGameSession);
      setGameSessionID({ dispatch, gameSessionID: parsedDetails.id });
    }
  }, [dispatch, gameSessionID]);
}
