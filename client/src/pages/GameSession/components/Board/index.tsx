import { useState } from 'react';

import {
  Cell, // force formatting
  GameBoard,
  PlayerColor,
  BOARD_ROWS,
  BOARD_COLS,
} from '@/pages/GameSession/constants';
import { setActivePlayer } from '@/store/game-session/actions';
import { useAppStore } from '@/store';
import { wsManager } from '@/utils';
import './styles.css';

function createEmptyBoard() {
  const emptyBoard: GameBoard = new Array(BOARD_ROWS).fill([]);

  for (let i = 0; i < BOARD_ROWS; i++) {
    for (let j = 0; j < BOARD_COLS; j++) {
      emptyBoard[i][j] = {
        state: null,
        row: i,
        column: j,
      };
    }
  }

  return emptyBoard;
}

export function Board() {
  const [board, setBoard] = useState(createEmptyBoard());

  const { appState, appDispatch } = useAppStore();
  const { gameSession, player } = appState;

  function handleCellClick(cell: Cell) {
    if (cell.state != null) {
      return;
    }

    const message = JSON.stringify({
      event: 'make-move',
      data: {
        columnIndex: cell.column,
        gameSessionID: gameSession.gameSessionID,
        playerID: player.playerID,
        timestamp: Date.now(),
      },
    });

    wsManager.getOpenWSConn().send(message);

    setActivePlayer({
      dispatch: appDispatch,
      player: gameSession.activePlayer === PlayerColor.RED ? PlayerColor.BLACK : PlayerColor.RED,
    });
  }

  return (
    <div id="board">
      {board.map((row) => {
        return row.map((cell) => {
          return (
            <div
              key={`${cell.row}-${cell.column}`}
              className="cell"
              id={`cell-${cell.row}-${cell.column}`}
              onClick={() => handleCellClick(cell)}
              // onClick={() => {
              //   const newBoard = [...board];
              //   newBoard[cell.row][cell.column].state = cell.state === CellState.EMPTY ? CellState.RED : CellState.EMPTY;
              //   setBoard(newBoard);
              // }}
            >
              <span>{cell.state}</span>
            </div>
          );
        });
      })}
    </div>
  );
}
