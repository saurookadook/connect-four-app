import { Fragment, FragmentProps } from 'react';
import { Link } from 'react-router-dom';

import { FlexColumn } from '@/layouts';
import { NoResults } from '..';
import { GameSessionsItem } from '@/types/main';
import './styles.css';

export function LoadedResultsState({
  gameSessions,
  parentID,
  ...props
}: FragmentProps & {
  gameSessions: GameSessionsItem[];
  parentID: string;
}) {
  return (
    <Fragment>
      {gameSessions.length > 0 ? (
        gameSessions.map((gameSession, index) => {
          const {
            id,
            playerOneID,
            playerOneUsername,
            playerTwoID,
            playerTwoUsername,
            status,
          } = gameSession;

          return (
            <FlexColumn key={`${parentID}-${id}`} className="game-session-history-item">
              <h3>{`Game Session ID: ${id}`}</h3>
              <span>{`Player 1 -- ${playerOneUsername}`}</span>
              <span>{`Player 2 -- ${playerTwoUsername}`}</span>
              <span>{`Status: ${status}`}</span>
              <Link className="view-session-cta" to={`/game-session/${id}`}>
                View Session
              </Link>
            </FlexColumn>
          );
        })
      ) : (
        <NoResults />
      )}
    </Fragment>
  );
}
