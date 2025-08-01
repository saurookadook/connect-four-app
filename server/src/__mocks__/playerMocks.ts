import { AuthenticationService } from '@/auth/authentication.service';
import { Player } from '@/players/schemas/player.schema';
import { mockNow } from './commonMocks';

type MockUnregisteredPlayer = Omit<Player, 'password'> & {
  unhashedPassword: string;
};

export const mockFirstPlayer: MockUnregisteredPlayer = {
  playerID: '80ac649a-ab17-4726-805e-d9cdd82e7eeb',
  username: 'player_uno',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
export const mockSecondPlayer: MockUnregisteredPlayer = {
  playerID: '55993b33-add4-4a8f-9549-bd41fe32a62c',
  username: 'player_dos',
  unhashedPassword: 'anothersuperduperpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
export const mockThirdPlayer: MockUnregisteredPlayer = {
  playerID: '5ba3e6b9-ff75-42b7-89e8-f362a4a3a4af',
  username: 'player_tres',
  unhashedPassword: 'eatmoarveggies',
  createdAt: mockNow,
  updatedAt: mockNow,
};

export const mockPlayerOneID = mockFirstPlayer.playerID;
export const mockPlayerTwoID = mockSecondPlayer.playerID;

export function createPlayerWithHashedPassword(
  unregisteredPlayer: MockUnregisteredPlayer,
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
