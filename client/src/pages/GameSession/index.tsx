import { useCallback, useEffect, useState } from 'react';

import { FlexColumn, FlexRow } from '@/layouts';
import { useAppStore } from '@/store';
import { wsManager } from '@/utils';
import { Board } from '@/pages/GameSession/components';
import { useLoadGame } from '@/pages/GameSession/utils/hooks';
import './styles.css';

export function GameSession() {
  const { appState, appDispatch } = useAppStore();
  const [wsData, setWsData] = useState<unknown[]>([]);

  const {
    gameSession: { activePlayer, gameSessionID },
    player: { playerID },
  } = appState;

  const wsMessageHandler = useCallback(
    (event: MessageEvent) => {
      console.log(
        '    [wsMessageHandler] Receiving message!     '.padStart(60, '-').padEnd(120, '-'),
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
      <div className="game-session-details">
        {gameSessionID != null && (
          <span>
            <b>Game Session ID</b>: {gameSessionID}
          </span>
        )}
        {playerID != null && (
          <span>
            <b>Player ID</b>: {playerID}
          </span>
        )}
      </div>

      <div>
        <h3>WebSocket Event Log</h3>
        <pre>
          <code>{JSON.stringify(wsData, null, 2)}</code>
        </pre>
      </div>

      <FlexRow>
        <FlexColumn id="game-details">
          <h3>{`Active player: ${activePlayer}`}</h3>
        </FlexColumn>

        <FlexColumn id="game-board-container">
          <Board />
        </FlexColumn>
      </FlexRow>
    </section>
  );
}
