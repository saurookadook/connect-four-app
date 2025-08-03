import { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  SEND_GAME_SESSION,
  SEND_MOVE,
  PlayerColor,
  sharedLog,
  safeParseJSON,
  type BaseWebSocketMessageEvent,
} from '@connect-four-app/shared';
import { LoadingState } from '@/components';
import { FlexColumn, FlexRow } from '@/layouts';
import { Board, DebuggingPanel, PlayerMoveLog } from '@/pages/GameSession/components';
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
      playerOneUsername,
      playerTwoID,
      playerTwoUsername,
      winner,
    },
    player: { playerID },
  } = appState;

  const wsMessageHandler = useCallback(
    (event: MessageEvent) => {
      const messageData = safeParseJSON<BaseWebSocketMessageEvent>(event.data);
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
        return;
      }

      switch (messageData.event) {
        case SEND_GAME_SESSION:
          logger.debug(`    wsMessageHandler - '${SEND_GAME_SESSION}' case`, {
            gameSessionData: messageData.data,
          });
          startGame({ dispatch: appDispatch, gameSessionData: messageData.data });
          break;
        case SEND_MOVE:
          logger.debug(`    wsMessageHandler - '${SEND_MOVE}' case`, {
            gameSessionData: messageData.data,
          });
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
    gameSession: appState.gameSession,
    playerID,
    wsMessageHandler,
  });

  useEffect(() => {
    return () => {
      wsManager.getOpenWSConn().removeEventListener('message', wsMessageHandler);
      wsManager.closeWSConn();
    };
  }, []);

  return (
    <section id="game-session">
      <h2>{`🔴 ⚫ Connect Four: Current Game 🔴 ⚫`}</h2>

      {winner != null && <h3>{`🏆🏆🏆 Winner: '${winner}' 🏆🏆🏆`}</h3>}

      <DebuggingPanel // force formatting
        gameSessionID={gameSessionID}
        playerID={playerID}
        wsData={wsData}
      />

      <FlexRow>
        <FlexColumn id="game-details">
          <h3>{`Active player: ${activePlayer}`}</h3>
          {/* TODO: maybe add `role="list"` to this and `role="listitem"` to `dt` elements */}
          <dl>
            <span>
              <b>Players</b>
            </span>
            {[playerOneID, playerTwoID].map((playerID, index) => {
              const details =
                playerID === playerOneID
                  ? {
                      suffix: `One (${PlayerColor.RED})`,
                      username: playerOneUsername,
                    }
                  : {
                      suffix: `Two (${PlayerColor.BLACK})`,
                      username: playerTwoUsername,
                    };

              return (
                playerID != null && (
                  <Fragment key={playerID}>
                    <dt
                      className={`data-item-${index}`}
                    >{`Player ${details.suffix}`}</dt>
                    <dd className={`data-item-${index}`}>{details.username}</dd>
                  </Fragment>
                )
              );
            })}
          </dl>

          <PlayerMoveLog />
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
