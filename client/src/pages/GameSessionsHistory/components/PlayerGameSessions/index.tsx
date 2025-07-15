import { useEffect } from 'react';

import { LoadingState } from '@/components';
import { FlexColumn } from '@/layouts';
import { fetchGameSessionsHistory } from '@/store/game-sessions/actions';
import { useAppStore } from '@/store';
import { LoadedResultsState } from '..';

export function PlayerGameSessions({
  containerID = 'player-game-sessions',
}: {
  containerID?: string;
}) {
  const { appState, appDispatch } = useAppStore();
  const { gameSessions, player } = appState;

  useEffect(() => {
    if (
      gameSessions.playerHistory == null &&
      !gameSessions.playerHistoryRequestInProgress
    ) {
      fetchGameSessionsHistory({
        dispatch: appDispatch, // force formatting
        playerID: player.playerID,
      });
    }
  }, [appDispatch, gameSessions.playerHistory, player.playerID]);

  return (
    <FlexColumn id={containerID}>
      <h3>Your Game Sessions</h3>

      <FlexColumn className="results-wrapper">
        {gameSessions.playerHistory == null ? (
          <LoadingState />
        ) : (
          <LoadedResultsState
            gameSessions={gameSessions.playerHistory}
            parentID={containerID}
          />
        )}
      </FlexColumn>
    </FlexColumn>
  );
}
