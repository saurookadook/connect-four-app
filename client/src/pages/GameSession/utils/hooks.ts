import { useEffect } from 'react';

import {
  START_GAME,
  sharedLog,
  type Nullable,
  type PlayerID,
} from '@connect-four-app/shared';
import { GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { type GameSessionStateSlice } from '@/store/game-session/reducer.types';
import { setPlayerID } from '@/store/actions';
import { AppDispatch } from '@/store';
import { RouterParams } from '@/types/main';
import { wsManager } from '@/utils';

const logger = sharedLog.getLogger(useLoadGame.name);

export function useLoadGame({
  dispatch, // force formatting
  params,
  gameSession,
  playerID,
  wsMessageHandler,
}: {
  dispatch: AppDispatch;
  params: RouterParams;
  gameSession: GameSessionStateSlice;
  playerID: Nullable<PlayerID>;
  wsMessageHandler: (event: MessageEvent) => void;
}) {
  const { gameSessionID, playerOneID, playerTwoID } = gameSession || {};

  // TODO: this should probably live in a separate `useLoadPlayer` hook
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
    if (
      params.gameSessionID == null ||
      playerID == null ||
      isCurrentGameSessionLoaded({ gameSession, params, playerID })
    ) {
      return;
    }

    wsManager.initializeConnection({ gameSessionID: params.gameSessionID, playerID });
    wsManager.getOpenWSConn().addEventListener('message', wsMessageHandler);

    // NOTE: this _might_ be unnecessary...?
    // or maybe the interval can be abstracted into a method as part of the WebSocketManager
    const initInterval = setInterval(() => {
      if (wsManager.getOpenWSConn().readyState !== wsManager.getOpenWSConn().OPEN) {
        return;
      }

      wsManager.getOpenWSConn().send(
        JSON.stringify({
          event: START_GAME,
          data: {
            gameSessionID: params.gameSessionID,
            playerOneID: playerOneID,
            playerTwoID: playerTwoID,
          },
        }),
      );

      clearInterval(initInterval);
    }, 250);
  }, [gameSessionID, playerID, wsMessageHandler]);
}

function isCurrentGameSessionLoaded({
  gameSession,
  params,
  playerID,
}: {
  gameSession: GameSessionStateSlice;
  params: RouterParams;
  playerID: Nullable<PlayerID>;
}) {
  return (
    playerID != null &&
    wsManager.ws == null &&
    gameSession.gameSessionID != null &&
    params.gameSessionID != null &&
    params.gameSessionID === gameSession.gameSessionID
  );
}
