import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { type PlayerMove } from '@connect-four-app/shared';
import { FlexRow } from '@/layouts';
import { useAppStore } from '@/store';
import './styles.css';

const columnHelper = createColumnHelper<PlayerMove>();

export function PlayerMoveLog({ ...props }) {
  const { appState } = useAppStore();
  const { moves, playerOneID, playerOneUsername, playerTwoUsername } =
    appState.gameSession;

  const movesTable = useReactTable({
    data: moves,
    columns: [
      columnHelper.accessor('playerID', {
        cell: (info) => {
          return info.getValue() === playerOneID
            ? playerOneUsername
            : playerTwoUsername;
        },
        header: 'Player Username',
      }),
      columnHelper.accessor('columnIndex', {
        cell: (info) => info.getValue() + 1,
        header: 'Column',
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <FlexRow id="player-move-log">
      <table>
        <thead>
          {movesTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((headerData) => (
                <th key={headerData.id}>
                  {headerData.isPlaceholder
                    ? null
                    : flexRender(
                        headerData.column.columnDef.header, // force formatting
                        headerData.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {movesTable.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell, // force formatting
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FlexRow>
  );
}
