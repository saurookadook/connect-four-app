import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { type PlayerMove } from '@connect-four-app/shared';
import { FlexRow } from '@/layouts';
import { useAppStore } from '@/store';

const columnHelper = createColumnHelper<PlayerMove>();

const columns = [
  columnHelper.accessor('playerID', {
    cell: (info) => info.getValue(),
    header: 'Player ID',
  }),
  columnHelper.accessor('columnIndex', {
    cell: (info) => info.getValue() + 1,
    header: 'Column',
  }),
];

export function PlayerMoveLog({ ...props }) {
  const { appState } = useAppStore();
  const { moves } = appState.gameSession;

  const movesTable = useReactTable({
    data: moves,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <FlexRow id="player-move-log">
      <table>
        <thead>
          {movesTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FlexRow>
  );
}
