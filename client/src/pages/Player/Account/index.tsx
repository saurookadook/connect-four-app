import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { type PlayerID } from '@connect-four-app/shared';
import { logOutPlayer } from '@/store/actions';
import { useAppStore } from '@/store';
import { Login, Register } from '../playerPages';
import { AppParams } from '@/types/main';

function AccountDetails() {
  const { appState, appDispatch } = useAppStore();
  const { email, playerID, username } = appState.player;

  function handleLogoutClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    logOutPlayer({ dispatch: appDispatch, playerID: playerID as PlayerID });
  }

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

      <button onClick={handleLogoutClick}>Log Out</button>
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

          <div>
            <span>{"Don't have an account? "}</span>
            <button onClick={() => navigate('/account/register')}>
              {'Register for one here'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Register />

          <div>
            <span>{'Already registered? '}</span>
            <button onClick={() => navigate('/account/login')}>{'Log In here'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AccountPortal() {
  const navigate = useNavigate();
  const { appState } = useAppStore();
  const { playerID } = appState.player;

  useEffect(() => {
    if (playerID == null) {
      navigate('/account/login');
    }
  }, [playerID]);

  return playerID == null ? ( // force formatting
    <NewPlayerForm />
  ) : (
    <AccountDetails />
  );
}
