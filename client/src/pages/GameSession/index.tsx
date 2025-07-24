import { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  SEND_GAME_SESSION,
  SEND_MOVE,
  START_GAME,
  PlayerColor,
  PlayerMove,
  sharedLog,
  safeParseJSON,
  type PlayerID,
} from '@connect-four-app/shared';
import { LoadingState } from '@/components';
import { FlexColumn, FlexRow } from '@/layouts';
import { Board, DebuggingPanel } from '@/pages/GameSession/components';
import { useLoadGame } from '@/pages/GameSession/utils/hooks';
import { startGame, updateGameState } from '@/store/actions';
import { useAppStore } from '@/store';
import { wsManager } from '@/utils';
import './styles.css';

const logger = sharedLog.getLogger(GameSession.name);

export function GameSession() {
  const { appState, appDispatch } = useAppStore();
  const [wsData, setWsData] = useState<unknown[]>([]);
  const params = useParams<{ gameSessionID?: string }>();

  const {
    gameSession: {
      gameSessionRequestInProgress,
      gameSessionID,
      activePlayer,
      playerOneID,
      playerTwoID,
    },
    player: { playerID },
  } = appState;

  const wsMessageHandler = useCallback(
    (event: MessageEvent) => {
      // TODO: make `safeParseJSON` generic
      const messageData = safeParseJSON(event.data) as { event: string; data: any };
      // logger.log(
      //   '    [wsMessageHandler] Receiving message!     '
      //     .padStart(60, '-')
      //     .padEnd(120, '-'),
      //   '\n',
      //   { event, messageData },
      //   '\n',
      //   '-'.repeat(120),
      // );

      if (messageData == null) {
        logger.error(
          `Encountered ERROR parsing message data: ${event.data} (type '${typeof event.data}')`,
        );
      }

      switch (messageData.event) {
        case SEND_GAME_SESSION:
          startGame({ dispatch: appDispatch, gameSessionData: messageData.data });
          break;
        case SEND_MOVE:
          updateGameState({
            dispatch: appDispatch,
            gameSessionData: messageData.data,
          });
          break;
        default:
          logger.log(
            `[GameSession - wsMessageHandler] No 'case' for event '${messageData.event}'`,
          );
      }

      setWsData((prevData) => [...prevData, messageData]);
    },
    [appDispatch],
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
            gameSessionID: gameSessionID,
            playerOneID: playerOneID,
            playerTwoID: playerTwoID,
          },
        }),
      );

      clearInterval(initInterval);
    }, 250);

    wsManager.getOpenWSConn().addEventListener('message', wsMessageHandler);

    return () => {
      wsManager.getOpenWSConn().removeEventListener('message', wsMessageHandler);
      wsManager.closeWSConn();
    };
  }, [gameSessionID, playerID, wsMessageHandler]);

  return (
    <section id="game-session">
      <h2>{`🔴 ⚫ Connect Four: Current Game 🔴 ⚫`}</h2>

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
              const suffix =
                index === 0 ? `One (${PlayerColor.RED})` : `Two (${PlayerColor.BLACK})`;

              return (
                playerID != null && (
                  <Fragment key={playerID}>
                    <dt>{`Player ${suffix}`}</dt>
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
