import { FlexRow } from '@/layouts';
import './styles.css';

export function DebuggingPanel({
  gameSessionID,
  playerID,
  wsData,
}: {
  gameSessionID: string | null;
  playerID: string | null;
  wsData: unknown[];
}) {
  return (
    <FlexRow
      style={{
        alignItems: 'unset',
        border: '2px solid var(--blue-darker-fill)',
        justifyContent: 'space-around',
        marginBottom: '1rem',
        maxHeight: '10rem',
        overflow: 'hidden',
      }}
    >
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

      <div id="ws-event-log">
        <h3>WebSocket Event Log</h3>
        <pre>
          <code>{JSON.stringify(wsData, null, 2)}</code>
        </pre>
      </div>
    </FlexRow>
  );
}
