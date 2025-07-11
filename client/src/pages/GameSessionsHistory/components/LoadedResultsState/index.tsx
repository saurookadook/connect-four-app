import { Fragment, FragmentProps } from 'react';

import { FlexColumn } from '@/layouts';
import { NoResults } from '..';
import { GameSessionsItem } from '@/types/main';

export function LoadedResultsState({
  gameSessions,
  ...props
}: FragmentProps & { gameSessions: GameSessionsItem[] }) {
  return (
    <Fragment>
      {gameSessions.length > 0 ? (
        gameSessions.map((gameSession, index) => {
          const { id, playerOneID, playerTwoID, status } = gameSession;
          return (
            <FlexColumn key={id} className="game-session-history-item">
              <h3>{`Game Session ID: ${id}`}</h3>
              <span>{`Player 1 -- '${playerOneID}'`}</span>
              <span>{`Player 2 -- '${playerTwoID}'`}</span>
              <span>{`Status: ${status}`}</span>
            </FlexColumn>
          );
        })
      ) : (
        <NoResults />
      )}
    </Fragment>
  );
}
