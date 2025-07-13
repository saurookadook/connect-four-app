import { useState } from 'react';

import { useAppStore } from '@/store';
import { Login, Register } from '../playerPages';

function AccountDetails({
  email,
  playerID,
  username,
}: {
  email?: string;
  playerID: string;
  username?: string;
}) {
  return (
    <div id="account-details">
      <h2>Account Details</h2>

      <dl>
        <dt>Player ID</dt>
        <dd>{playerID}</dd>

        <dt>Email</dt>
        <dd>{email ?? '⚠️ Not set'}</dd>

        <dt>Username</dt>
        <dd>{username ?? '⚠️ Not set'}</dd>
      </dl>
    </div>
  );
}

function NewPlayerForm() {
  const [isNewPlayer, setIsNewPlayer] = useState(false);

  return (
    <div id="new-player-form">
      {isNewPlayer ? (
        <Register />
      ) : (
        <div>
          <Login />

          <span>
            {"Don't have an account? "}
            <button onClick={() => setIsNewPlayer(true)}>{'Register for one here'}</button>
          </span>
        </div>
      )}
    </div>
  );
}

export function AccountPortal() {
  const { appState } = useAppStore();
  const { playerID } = appState.player;

  return playerID == null ? ( // force formatting
    <NewPlayerForm />
  ) : (
    <AccountDetails playerID={playerID} />
  );
}
