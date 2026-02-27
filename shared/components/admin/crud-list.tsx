'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '../ui/data-table';

interface CRUDListProps {
  title: string;
  description: string;
  createHref: string;
  columns: Array<{ key: string; label: string; width?: string }>;
  rows: Array<any>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CRUDList({
  title,
  description,
  createHref,
  columns,
  rows,
  onEdit,
  onDelete,
}: CRUDListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-foreground mb-1">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {createHref ? (
          <Link
            href={createHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:opacity-90 transition-all duration-300"
          >
            <Plus size={20} />
            Crear Nuevo
          </Link>
        ) : null}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm p-6 transition-all duration-300 overflow-hidden">
        <DataTable columns={columns} rows={filteredRows} />
      </div>
    </div>
  );
}
