import { useEffect, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { sharedLog, type PlayerID } from '@connect-four-app/shared';
import { LoadingState } from '@/components';
import { FlexColumn, FlexRow } from '@/layouts';
import { fetchPlayersData, makeStartGameRequest } from '@/store/actions';
import { useAppStore } from '@/store';
import './styles.css';

const logger = sharedLog.getLogger(Matchmaking.name);

export function Matchmaking() {
  const navigate = useNavigate();
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
    logger.debug(event);

    return makeStartGameRequest({
      dispatch: appDispatch,
      playerOneID: player.playerID as PlayerID,
      playerTwoID: playerTwoID,
    })
      .then((result) => {
        // TODO: need to fix backend response
        return navigate(`/game-session/${result.gameSession._id}`);
      })
      .catch((error) => {
        logger.error(error.message, error);
        window.alert('Unable to start your game! ☹️');
      });
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
