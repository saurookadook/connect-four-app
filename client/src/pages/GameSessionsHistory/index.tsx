import { AllGameSessions, PlayerGameSessions } from './components';
import { FlexRow } from '@/layouts';
import './styles.css';

export function GameSessionsHistory() {
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
