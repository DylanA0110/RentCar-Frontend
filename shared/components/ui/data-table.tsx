'use client';

import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

interface DataTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  actions?: (row: TableRow) => React.ReactNode;
  onRowClick?: (row: TableRow) => void;
}

export function DataTable({
  columns,
  rows,
  actions,
  onRowClick,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <table className="w-full min-w-max md:min-w-full">
        <thead>
          <tr className="border-b border-border bg-secondary">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors duration-300 ${
                  col.width || ''
                }`}
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {sortKey === col.key && (
                    <div className="text-accent">
                      {sortOrder === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, idx) => (
            <tr
              key={row.id}
              className="border-b border-border hover:bg-secondary/50 transition-colors duration-300 cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={`${row.id}-${col.key}`}
                  className="px-6 py-4 text-sm text-foreground"
                >
                  {row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-right">
                  <div onClick={(e) => e.stopPropagation()}>{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay datos para mostrar</p>
        </div>
      )}
    </div>
  );
}
