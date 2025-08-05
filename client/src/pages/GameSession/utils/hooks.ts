import { useEffect } from 'react';

import {
  START_GAME,
  sharedLog,
  type Nullable,
  type PlayerID,
} from '@connect-four-app/shared';
import { GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { type GameSessionStateSlice } from '@/store/game-session/reducer.types';
import { AppDispatch, useAppStore } from '@/store';
import { RouterParams } from '@/types/main';
import { wsManager } from '@/utils';
import { PlayerStateSlice } from '@/store/player/reducer.types';

const logger = sharedLog.getLogger(useLoadGame.name);

export function useLoadGame({
  dispatch, // force formatting
  params,
  wsMessageHandler,
}: {
  dispatch: AppDispatch;
  params: RouterParams;
  wsMessageHandler: (event: MessageEvent) => void;
}) {
  const { appState } = useAppStore();
  const { gameSession, player } = appState;

  useEffect(() => {
    if (
      params.gameSessionID == null ||
      player.playerID == null ||
      isCurrentGameSessionLoaded({ gameSession, params, player })
    ) {
      return;
    }

    wsManager.initializeConnection({
      gameSessionID: params.gameSessionID,
      playerID: player.playerID,
    });
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
            playerOneID: gameSession.playerOneID,
            playerTwoID: gameSession.playerTwoID,
          },
        }),
      );

      clearInterval(initInterval);
    }, 250);
  }, [gameSession.gameSessionID, player.playerID, wsMessageHandler]);
}

function isCurrentGameSessionLoaded({
  gameSession,
  params,
  player,
}: {
  gameSession: GameSessionStateSlice;
  params: RouterParams;
  player: PlayerStateSlice;
}) {
  return (
    player.playerID != null &&
    wsManager.ws == null &&
    gameSession.gameSessionID != null &&
    params.gameSessionID != null &&
    params.gameSessionID === gameSession.gameSessionID
  );
}
