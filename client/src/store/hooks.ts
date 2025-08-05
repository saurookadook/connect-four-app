import { useContext, useEffect } from 'react';

import { safeParseJSON, sharedLog } from '@connect-four-app/shared';
import { PLAYER_DETAILS_LS_KEY } from '@/constants';
import { refreshPlayerData, setPlayerInfo } from './actions';
import { AppStateContext, AppDispatchContext } from './contexts';

const logger = sharedLog.getLogger('store/hooks');

export function useAppStore() {
  const funcName = useAppStore.name;

  const state = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  return {
    appState: state, // force formatting
    appDispatch: dispatch,
  };
}

export function useLoadPlayer() {
  const funcName = useLoadPlayer.name;

  const { appState, appDispatch } = useAppStore();
  const { playerID } = appState.player;

  useEffect(() => {
    logger.debug(`${funcName} 'playerID'\n`, {
      playerID,
    });

    if (playerID != null) {
      return;
    }

    const storedPlayerDetails = window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);
    const parsedDetails = safeParseJSON(storedPlayerDetails);
    logger.debug(`${funcName} 'storedPlayerDetails'\n`, {
      storedPlayerDetails,
      parsedDetails,
    });

    if (parsedDetails != null) {
      setPlayerInfo({
        dispatch: appDispatch,
        playerDetails: {
          playerID: parsedDetails.playerID,
          playerObjectID: parsedDetails.playerObjectID,
          username: parsedDetails.username,
        },
      });
    } else {
      refreshPlayerData({ dispatch: appDispatch });
    }
  }, [appDispatch, playerID]);
}
