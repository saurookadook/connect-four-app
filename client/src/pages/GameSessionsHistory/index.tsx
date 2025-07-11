import { AllGameSessions, PlayerGameSessions } from './components';
import { FlexRow } from '@/layouts';
import { useAppStore } from '@/store';
import './styles.css';

export function GameSessionsHistory() {
  const { appState, appDispatch } = useAppStore();
  const { gameSessions, player } = appState;

  return (
    <section id="game-sessions-history">
      <h2>{`🗒️ Game Sessions History 🗒️`}</h2>

      <FlexRow>
        <AllGameSessions />

        <PlayerGameSessions />
      </FlexRow>
    </section>
  );
}
