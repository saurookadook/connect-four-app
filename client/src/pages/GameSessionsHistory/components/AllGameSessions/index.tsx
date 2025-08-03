import { useEffect } from 'react';

import { sharedLog } from '@connect-four-app/shared';
import { LoadingState } from '@/components';
import { FlexColumn } from '@/layouts';
import { fetchAllGameSessions } from '@/store/actions';
import { useAppStore } from '@/store';
import { LoadedResultsState } from '..';

const logger = sharedLog.getLogger(AllGameSessions.name);

export function AllGameSessions({
  containerID = 'all-game-sessions',
}: {
  containerID?: string;
}) {
  const { appState, appDispatch } = useAppStore();
  const { gameSessions } = appState;

  useEffect(() => {
    if (
      gameSessions.allPaginated == null &&
      !gameSessions.allPaginatedRequestInProgress
    ) {
      fetchAllGameSessions({ dispatch: appDispatch });
    }
  }, [appDispatch, gameSessions.allPaginated]);

  logger.debug('allPaginated\n', {
    allPaginated: gameSessions.allPaginated,
  });

  return (
    <FlexColumn id={containerID}>
      <h3>Browse All Game Sessions</h3>

      <FlexColumn className="results-wrapper">
        {gameSessions.allPaginated == null ? (
          <LoadingState />
        ) : (
          <LoadedResultsState
            gameSessions={gameSessions.allPaginated}
            parentID={containerID}
          />
        )}
      </FlexColumn>
    </FlexColumn>
  );
}
