import { Nullable, PlayerColor, type PlayerID } from '@connect-four-app/shared';

export function canPlayerMakeMove({
  activePlayer,
  playerID,
  playerOneID,
  playerTwoID,
}: {
  activePlayer: PlayerColor;
  playerID: Nullable<PlayerID>;
  playerOneID: Nullable<PlayerID>;
  playerTwoID: Nullable<PlayerID>;
}) {
  // prettier-ignore
  return (
    playerID != null && playerOneID != null && playerTwoID != null &&
    (activePlayer === PlayerColor.RED && playerID === playerOneID) ||
    (activePlayer === PlayerColor.BLACK && playerID === playerTwoID)
  );
}
