import classNames from 'classnames';

import {
  MAKE_MOVE, // force formatting
  PlayerColor,
  type BoardCell,
} from '@connect-four-app/shared';
import { canPlayerMakeMove } from '@/pages/GameSession/utils';
import { useAppStore } from '@/store';
import { wsManager } from '@/utils';
import './styles.css';

/**
 * @notes
 * - need to figure out way to create/render layers correctly
 *    (i.e. pieces render 'behind' game board)
 * - should this eventually be rendered with `<canvas>`?
 */
export function Board() {
  const { appState, appDispatch } = useAppStore();
  const { gameSession, player } = appState;

  function handleCellClick(cell: BoardCell) {
    if (gameSession.winner != null) {
      window.alert(
        `Can't carry out move; the game has been won by '${gameSession.winner}'.`,
      );
      return;
    } else if (
      !canPlayerMakeMove({
        activePlayer: gameSession.activePlayer,
        playerID: player.playerID,
        playerOneID: gameSession.playerOneID,
        playerTwoID: gameSession.playerTwoID,
      })
    ) {
      // TODO: use something like an Admonition instead
      window.alert('No cheating! 🤪');
      return;
    } else if (cell.cellState != null) {
      return;
    }

    const message = JSON.stringify({
      event: MAKE_MOVE,
      data: {
        columnIndex: cell.col,
        gameSessionID: gameSession.gameSessionID,
        playerID: player.playerID,
        timestamp: Date.now(),
      },
    });

    wsManager.getOpenWSConn().send(message);
  }

  return (
    <div id="board">
      {gameSession.boardCells.map((column, index) => {
        return (
          <div key={`col-${index}`} className={`board-col-${index}`}>
            {column.map((cell) => {
              return (
                <div
                  key={`${cell.col}-${cell.row}`}
                  className={classNames({
                    cell: true,
                    red: cell.cellState === gameSession.playerOneID,
                    black: cell.cellState === gameSession.playerTwoID,
                  })}
                  id={`cell-${cell.col}-${cell.row}`}
                  onClick={() => handleCellClick(cell)}
                >
                  <span
                    className={classNames({
                      red: cell.cellState === gameSession.playerOneID,
                      black: cell.cellState === gameSession.playerTwoID,
                    })}
                    data-cell-state={cell.cellState}
                  ></span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
