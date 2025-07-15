import { useState } from 'react';

import {
  Cell, // force formatting
  PlayerColor,
} from '@/pages/GameSession/constants';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { setActivePlayer } from '@/store/game-session/actions';
import { useAppStore } from '@/store';
import { wsManager } from '@/utils';
import './styles.css';

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
      {board.map((column) => {
        return column.map((cell) => {
          return (
            <div
              key={`${cell.column}-${cell.row}`}
              className="cell"
              id={`cell-${cell.column}-${cell.row}`}
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
