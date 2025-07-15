import { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components';
import { FlexColumn, FlexRow } from '@/layouts';
import { Board, DebuggingPanel } from '@/pages/GameSession/components';
import { useLoadGame } from '@/pages/GameSession/utils/hooks';
import { useAppStore } from '@/store';
import { wsManager } from '@/utils';
import './styles.css';

export function GameSession() {
  const { appState, appDispatch } = useAppStore();
  const [wsData, setWsData] = useState<unknown[]>([]);
  const params = useParams<{ gameSessionID?: string }>();

  const {
    gameSession: {
      gameSessionRequestInProgress,
      activePlayer,
      gameSessionID,
      playerOneID,
      playerTwoID,
    },
    player: { playerID },
  } = appState;

  const wsMessageHandler = useCallback(
    (event: MessageEvent) => {
      console.log(
        '    [wsMessageHandler] Receiving message!     '
          .padStart(60, '-')
          .padEnd(120, '-'),
        '\n',
        { event, eventData: event.data },
        '\n',
        '-'.repeat(120),
      );
      const messageData = (() => {
        try {
          return JSON.parse(event.data);
        } catch {
          return event.data;
        }
      })();
      // setReceiveMessage({ dispatch: appDispatch, receivedMessage: messageData });
      setWsData((prevData) => [...prevData, messageData]);
    },
    [],
    // [appDispatch],
  );

  useLoadGame({
    dispatch: appDispatch,
    params,
    gameSessionID,
    playerID,
  });

  useEffect(() => {
    if (gameSessionID == null || playerID == null || wsManager.ws != null) {
      return;
    }

    wsManager.initializeConnection({ gameSessionID, playerID });
    wsManager.getOpenWSConn().addEventListener('message', wsMessageHandler);

    return () => {
      wsManager.getOpenWSConn().removeEventListener('message', wsMessageHandler);
      wsManager.closeWSConn();
    };
  }, [gameSessionID, playerID, wsMessageHandler]);

  return (
    <section id="game-session">
      <h2>{`🔴 ⚫ Connect Four 🔴 ⚫`}</h2>

      <DebuggingPanel // force formatting
        gameSessionID={gameSessionID}
        playerID={playerID}
        wsData={wsData}
      />

      <FlexRow>
        <FlexColumn id="game-details">
          <h3>{`Active player: ${activePlayer}`}</h3>
          <dl>
            <span>
              <b>Players</b>
            </span>
            {[playerOneID, playerTwoID].map((playerID, index) => {
              return (
                playerID != null && (
                  <Fragment key={playerID}>
                    <dt>{`Player ${index === 0 ? 'One' : 'Two'}`}</dt>
                    <dd>{playerID}</dd>
                  </Fragment>
                )
              );
            })}
          </dl>
        </FlexColumn>

        <FlexColumn id="game-board-container">
          {gameSessionRequestInProgress || gameSessionID == null ? (
            <LoadingState />
          ) : (
            <Board />
          )}
        </FlexColumn>
      </FlexRow>
    </section>
  );
}
