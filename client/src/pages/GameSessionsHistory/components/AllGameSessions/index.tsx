import { useEffect } from 'react';

import { LoadingState } from '@/components';
import { FlexColumn } from '@/layouts';
import { fetchAllGameSessions } from '@/store/game-sessions/actions';
import { useAppStore } from '@/store';
import { LoadedResultsState } from '..';

export function AllGameSessions() {
  const { appState, appDispatch } = useAppStore();
  const { gameSessions } = appState;

  useEffect(() => {
    if (gameSessions.allPaginated == null) {
      fetchAllGameSessions({ dispatch: appDispatch });
    }
  }, [appDispatch, gameSessions.allPaginated]);

  return (
    <FlexColumn id="all-game-sessions">
      <h3>Browse All Game Sessions</h3>

      <FlexColumn className="results-wrapper">
        {gameSessions.allPaginated == null ? (
          <LoadingState />
        ) : (
          <LoadedResultsState gameSessions={gameSessions.allPaginated} />
        )}
      </FlexColumn>
    </FlexColumn>
  );
}
