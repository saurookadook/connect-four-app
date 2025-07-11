import { useCallback, useEffect, useState } from 'react';

import { FlexColumn, FlexRow } from '@/layouts';
import { useAppStore } from '@/store';
import { ws } from '@/utils';
import { Board } from '@ConnectFour/components';
import { useLoadGame } from '@ConnectFour/utils/hooks';
import './styles.css';

export function ConnectFour() {
  const { appState, appDispatch } = useAppStore();
  const [gameSessionID, setGameSessionID] = useState<string | null>(null);
  const [playerID, setPlayerID] = useState<string | null>(null);
  const [wsData, setWsData] = useState<unknown[]>([]);

  const wsMessageHandler = useCallback(
    (event: MessageEvent) => {
      // console.log('    [WebSocket] Receiving message!     '.padStart(60, '-').padEnd(120, '-'));
      // console.log('\n');
      console.log({ event });
      // console.log('\n');
      const messageData = JSON.parse(event.data);
      // setReceiveMessage({ dispatch: appDispatch, receivedMessage: messageData });
      setWsData((prevData) => [...prevData, messageData]);
    },
    [],
    // [appDispatch],
  );

  function handleSendMessage() {
    ws.send(
      JSON.stringify({
        event: 'health-check',
        data: {
          message: '[client] Hello, world!',
        },
      }),
    );
  }

  useLoadGame({
    gameSessionID,
    setGameSessionID,
    playerID,
    setPlayerID,
  });

  useEffect(() => {
    ws.addEventListener('message', wsMessageHandler);

    return () => {
      ws.removeEventListener('message', wsMessageHandler);
    };
  }, [wsMessageHandler]);

  return (
    <section id="connect-four">
      <h2>{`🔴 ⚫ Connect Four 🔴 ⚫`}</h2>
      <div>{playerID != null && <span>{`Player ID: ${playerID}`}</span>}</div>

      <button onClick={handleSendMessage}>Send WS Message</button>

      <div>
        <pre>
          <code>{JSON.stringify(wsData, null, 2)}</code>
        </pre>
      </div>

      <FlexRow>
        <FlexColumn id="game-details">
          <h3>{`Active player: ${appState.connectFour.activePlayer}`}</h3>
        </FlexColumn>

        <FlexColumn id="game-board-container">
          <Board />
        </FlexColumn>
      </FlexRow>
    </section>
  );
}
