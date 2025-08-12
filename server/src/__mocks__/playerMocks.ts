import { AuthenticationService } from '@/auth/authentication.service';
import { Player } from '@/players/schemas/player.schema';

/** @note Players of this type may or may not be registered */
export type MockPlayer = Omit<Player, 'password'> & {
  unhashedPassword: string;
};

export const mockFirstPlayer: MockPlayer = {
  playerID: '80ac649a-ab17-4726-805e-d9cdd82e7eeb',
  username: 'player_uno',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: new Date(Date.now() + 90),
  updatedAt: new Date(Date.now() + 100),
};
export const mockSecondPlayer: MockPlayer = {
  playerID: '55993b33-add4-4a8f-9549-bd41fe32a62c',
  username: 'player_dos',
  unhashedPassword: 'anothersuperduperpassword',
  createdAt: new Date(Date.now() + 110),
  updatedAt: new Date(Date.now() + 140),
};
export const mockThirdPlayer: MockPlayer = {
  playerID: '5ba3e6b9-ff75-42b7-89e8-f362a4a3a4af',
  username: 'player_tres',
  unhashedPassword: 'eatmoarveggies',
  createdAt: new Date(Date.now() + 170),
  updatedAt: new Date(Date.now() + 185),
};

export const mockPlayerOneID = mockFirstPlayer.playerID;
export const mockPlayerTwoID = mockSecondPlayer.playerID;

export function createPlayerWithHashedPassword(
  unregisteredPlayer: MockPlayer,
): Player {
  const { unhashedPassword, ...rest } = unregisteredPlayer;
  return {
    ...rest,
    password: AuthenticationService.createPasswordHashSync(unhashedPassword),
  };
}

export const mockPlayers = [
  mockFirstPlayer, // force formatting
  mockSecondPlayer,
  mockThirdPlayer,
].map(createPlayerWithHashedPassword);
