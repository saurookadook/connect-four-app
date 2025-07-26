import { useState } from 'react';

import { safeParseJSON } from '@connect-four-app/shared';
import { DEBUG_LS_KEY } from '@/constants';
import { FlexRow } from '@/layouts';
import { useAppStore } from '@/store';
import './styles.css';
import classNames from 'classnames';

export function DebuggingPanel({
  gameSessionID,
  playerID,
  wsData,
}: {
  gameSessionID: string | null;
  playerID: string | null;
  wsData: unknown[];
}) {
  const debugEnabled = safeParseJSON<boolean>(
    window.localStorage.getItem(DEBUG_LS_KEY),
  );

  const [shouldDisplay, setShouldDisplay] = useState(debugEnabled);

  // @ts-expect-error
  window.__cfToggleDebug = () => {
    const newValue = !shouldDisplay;
    window.localStorage.setItem(DEBUG_LS_KEY, String(newValue));
    setShouldDisplay(newValue);
  };

  const { appState } = useAppStore();

  return (
    shouldDisplay && (
      <FlexRow id="debug-panel">
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

          <CollapsibleCodeBlock data={appState} />
        </div>

        <div id="ws-event-log">
          <h3>WebSocket Event Log</h3>
          <SimpleCodeBlock data={wsData} />
        </div>
      </FlexRow>
    )
  );
}

// TODO: all of this stuff below should probably live elsewhere
type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

function CollapsibleCodeBlock({
  data, // force formatting
  depth = 1,
  ...props
}: DivProps & {
  data?: object | Array<any>;
  depth?: number;
}) {
  function Content() {
    if (data == null) {
      return null;
    }

    const styleProp = {
      marginLeft: depth > 0 ? `${depth / 2}rem` : `${depth}rem`,
    };

    if (Array.isArray(data)) {
      return <SimpleCodeBlock data={data} />;
    }

    return (
      <>
        {Object.keys(data).map((key, index) => {
          // @ts-expect-error
          const value = data[key];

          return isArrayOrObject(value) ? (
            <details key={`${key}-${index}`} style={styleProp}>
              <summary>
                <code>{key}</code>
              </summary>

              <CollapsibleCodeBlock data={value} depth={depth + 1} style={styleProp} />
            </details>
          ) : (
            <SimpleCodeBlock
              key={`${key}-${index}`}
              data={`${key}: ${value}`}
              style={styleProp}
            />
          );
        })}
      </>
    );
  }

  return (
    <div // force formatting
      className={classNames('code-block', 'collapsible')}
    >
      <Content />
    </div>
  );
}

function SimpleCodeBlock({
  data, // force formatting
  ...props
}: DivProps & {
  data?: any;
}) {
  return (
    data != null && (
      <div className="code-block" {...props}>
        <pre>
          <code>
            {isArrayOrObject(data) ? JSON.stringify(data, null, 2) : `${data}`}
          </code>
        </pre>
      </div>
    )
  );
}

function isArrayOrObject(val: unknown): boolean {
  return (
    val != null &&
    (Array.isArray(val) || (typeof val === 'object' && Object.keys(val).length > 0))
  );
}
