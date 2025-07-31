import { useEffect, type MouseEvent } from 'react';

import { sharedLog, type PlayerID } from '@connect-four-app/shared';
import { LoadingState } from '@/components';
import { FlexColumn, FlexRow } from '@/layouts';
import { fetchPlayersData, makeStartGameRequest } from '@/store/actions';
import { useAppStore } from '@/store';
import './styles.css';

const logger = sharedLog.getLogger(Matchmaking.name);

export function Matchmaking() {
  const { appState, appDispatch } = useAppStore();
  const { matchmaking, player } = appState;

  useEffect(() => {
    if (matchmaking.playersDataRequestInProgress || matchmaking.playersData != null) {
      return;
    }

    fetchPlayersData({
      dispatch: appDispatch,
      currentPlayerID: player.playerID as PlayerID,
    });
  }, [
    matchmaking.playersDataRequestInProgress,
    matchmaking.playersData,
    player.playerID,
  ]);

  function handleOnStartGameClick(
    event: MouseEvent<HTMLButtonElement>,
    playerTwoID: PlayerID,
  ) {
    logger.debug(
      `[${Matchmaking.name}.${handleOnStartGameClick.name}] playerTwoID: '${playerTwoID}' \n`,
    );
    console.dir(event);
  }

  return (
    <section id="matchmaking">
      <h2>{`⚔️ Matchmaking ⚔️`}</h2>

      <FlexColumn>
        {matchmaking.playersData == null ? (
          <LoadingState />
        ) : (
          <ul>
            {matchmaking.playersData.map(({ playerID, username }, index) => {
              return (
                <li key={playerID} className="flex-row">
                  <span>{`${username} ('${playerID}')`}</span>

                  <button onClick={(e) => handleOnStartGameClick(e, playerID)}>
                    Challenge to Match
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </FlexColumn>
    </section>
  );
}
