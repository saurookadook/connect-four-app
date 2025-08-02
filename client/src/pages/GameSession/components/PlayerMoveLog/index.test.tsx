import { inspect } from 'node:util';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import {
  afterAll, // force formatting
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  LogicBoard,
  GameSessionStatus,
  moveTuplesByGenerator,
  populateBoardWithDescendingSlopeDiagonalWinOne,
  PlayerColor,
} from '@connect-four-app/shared';
import {
  findGameSessionMockForPlayers,
  type GameSessionMock,
} from '@/__mocks__/gameSessionsMocks';
import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import { updateGameState } from '@/store/actions';
import { AppStateProvider, useAppStore, type AppState } from '@/store';
import { PlayerMoveLog } from '.';

/* START TEST SETUP */
const mockGameSession = findGameSessionMockForPlayers({
  playerOneID: mockFirstPlayer.playerID,
  playerTwoID: mockSecondPlayer.playerID,
}) as GameSessionMock;
const emptyBoard = LogicBoard.createEmptyBoardState();
const createTestInitialState = () => ({
  gameSession: {
    gameSessionRequestInProgress: false,
    activePlayer: PlayerColor.RED,
    gameSessionID: mockGameSession.id,
    boardCells: emptyBoard,
    moves: [],
    playerOneID: mockGameSession.playerOneID,
    playerTwoID: mockGameSession.playerTwoID,
    status: GameSessionStatus.ACTIVE,
    winner: null,
  },
});

const moveTuples =
  moveTuplesByGenerator[populateBoardWithDescendingSlopeDiagonalWinOne.name];

function getPlayerMoveLog(containerRef: HTMLElement) {
  return containerRef.querySelector('#player-move-log') as HTMLDivElement;
}

function TriggerUpdateGameStateButton() {
  const logicBoardRef = useRef(new LogicBoard());
  const [nextMoveIndex, setNextMoveIndex] = useState(0);
  const { appState, appDispatch } = useAppStore();
  const { gameSession } = appState;

  function handleOnButtonClick() {
    const [columnIndex] = moveTuples[nextMoveIndex];
    const playerID =
      nextMoveIndex % 2 === 0 // force formatting
        ? mockGameSession.playerOneID
        : mockGameSession.playerTwoID;
    const nextPlayerMove = {
      columnIndex,
      gameSessionID: gameSession.gameSessionID as string,
      playerID,
      timestamp: new Date(),
    };

    logicBoardRef.current.updateBoardState({
      columnIndex,
      playerID,
    });

    setNextMoveIndex(nextMoveIndex + 1);
    updateGameState({
      dispatch: appDispatch,
      gameSessionData: {
        gameSessionID: gameSession.gameSessionID,
        boardCells: logicBoardRef.current.gameBoardState,
        moves: [...gameSession.moves, nextPlayerMove],
        playerOneID: gameSession.playerOneID,
        playerTwoID: gameSession.playerTwoID,
        status: gameSession.status,
        winner: null,
      },
    });
  }

  return <button onClick={handleOnButtonClick}>Trigger Update Game State</button>;
}

function PlayerMoveLogWithProvider({
  initialState, // more formatting
}: {
  initialState: Partial<AppState>;
}) {
  return (
    <AppStateProvider initialState={initialState}>
      <div id="test-wrapper">
        <TriggerUpdateGameStateButton />
        <PlayerMoveLog />
      </div>
    </AppStateProvider>
  );
}
/* END TEST SETUP */

describe('PlayerMoveLog', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { container } = render(
      <PlayerMoveLogWithProvider initialState={createTestInitialState()} />,
    );

    let playerMoveLogEl: HTMLDivElement;

    await waitFor(() => {
      playerMoveLogEl = getPlayerMoveLog(container);
      expect(playerMoveLogEl).not.toBeNull();
      expect(playerMoveLogEl).toBeVisible();
    });

    // @ts-expect-error: This should go away once the test config is loaded correctly
    const theadEl = playerMoveLogEl.querySelector('thead') as HTMLTableSectionElement;

    expect(within(theadEl).getByText('Player ID')).toBeVisible();
    expect(within(theadEl).getByText('Column')).toBeVisible();

    // @ts-expect-error: This should go away once the test config is loaded correctly
    const tbodyEl = playerMoveLogEl.querySelector('tbody') as HTMLTableSectionElement;

    expect(tbodyEl.querySelectorAll('tr').length).toBe(0);
  });

  it("updates correctly when move is added to 'gameSession' state slice", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PlayerMoveLogWithProvider initialState={createTestInitialState()} />,
    );

    let playerMoveLogEl: HTMLDivElement;

    await waitFor(() => {
      playerMoveLogEl = getPlayerMoveLog(container);
      expect(playerMoveLogEl).not.toBeNull();
      expect(playerMoveLogEl).toBeVisible();
    });

    // @ts-expect-error: This should go away once the test config is loaded correctly
    const theadEl = playerMoveLogEl.querySelector('thead') as HTMLTableSectionElement;

    expect(within(theadEl).getByText('Player ID')).toBeVisible();
    expect(within(theadEl).getByText('Column')).toBeVisible();

    // @ts-expect-error: This should go away once the test config is loaded correctly
    const tbodyEl = playerMoveLogEl.querySelector('tbody') as HTMLTableSectionElement;

    expect(tbodyEl.querySelectorAll('tr').length).toBe(0);

    await user.click(screen.getByRole('button', { name: 'Trigger Update Game State' }));

    const trEls = tbodyEl.querySelectorAll('tr');
    expect(trEls.length).toBeGreaterThan(0);

    trEls.forEach((trEl, index) => {
      const playerID =
        index % 2 === 0 ? mockGameSession.playerOneID : mockGameSession.playerTwoID;

      expect(within(trEl).getByText(playerID)).toBeVisible();
    });
  });
});
