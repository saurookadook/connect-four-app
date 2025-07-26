import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppStore } from '@/store';
import { Login, Register } from '../playerPages';
import { AppParams } from '@/types/main';

function AccountDetails() {
  const { appState } = useAppStore();
  const { email, playerID, username } = appState.player;

  return (
    <div id="account-details">
      <h2>Account Details</h2>

      <dl>
        <dt>Player ID</dt>
        <dd>
          <code>{`'${playerID}'`}</code>
        </dd>

        <dt>Email</dt>
        <dd>{email != null ? <code>{email}</code> : '⚠️ Not set'}</dd>

        <dt>Username</dt>
        <dd>{username != null ? <code>{username}</code> : '⚠️ Not set'}</dd>
      </dl>
    </div>
  );
}

function NewPlayerForm() {
  const navigate = useNavigate();
  const params = useParams<AppParams>();

  return (
    <div id="new-player-form">
      {/* This feels a little sloppy but ¯\_(ツ)_/¯ */}
      {params.subPage === 'login' ? (
        <div>
          <Login />

          <span>
            {"Don't have an account? "}
            <button onClick={() => navigate('/account/register')}>
              {'Register for one here'}
            </button>
          </span>
        </div>
      ) : (
        <Register />
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
    <AccountDetails />
  );
}
