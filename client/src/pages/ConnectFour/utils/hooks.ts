import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '../constants';

type SetStateFunction = Dispatch<SetStateAction<string | null>>;

export function useLoadGame({
  gameSessionID, // force formatting
  setGameSessionID,
  playerID,
  setPlayerID,
}: {
  gameSessionID: string | null;
  setGameSessionID: SetStateFunction;
  playerID: string | null;
  setPlayerID: SetStateFunction;
}) {
  useEffect(() => {
    if (playerID != null) {
      return;
    }

    const storedPlayerDetails = window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);

    if (storedPlayerDetails != null) {
      const parsedDetails = JSON.parse(storedPlayerDetails);
      setPlayerID(parsedDetails.playerID);
    }
  }, [playerID, setPlayerID]);

  useEffect(() => {
    if (gameSessionID != null) {
      return;
    }

    const storedGameSession = window.localStorage.getItem(GAME_SESSION_LS_KEY);

    if (storedGameSession != null) {
      const parsedDetails = JSON.parse(storedGameSession);
      setGameSessionID(parsedDetails.id);
    } else {
      // TODO: remove this once session endpoints are hooked up
      const newGameSessionID = window.crypto.randomUUID();
      const stringifiedDetails = JSON.stringify({ id: newGameSessionID });
      window.localStorage.setItem(GAME_SESSION_LS_KEY, stringifiedDetails);
      setGameSessionID(newGameSessionID);
    }
  }, [gameSessionID, setGameSessionID]);
}
