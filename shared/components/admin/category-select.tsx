'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useCategorias } from '@/modules/categorias/hook/useCategorias';
import { cn } from '@/shared/lib/utils';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CategorySelect({
  value,
  onChange,
  error,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categorias, isLoading } = useCategorias();

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categorias ?? [];

    return (categorias ?? []).filter((cat) =>
      cat.nombre.toLowerCase().includes(term),
    );
  }, [categorias, searchTerm]);

  const selectedCategory = useMemo(
    () => (categorias ?? []).find((cat) => cat.id === value),
    [categorias, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full rounded-xl border bg-background px-4 py-3 text-left transition-colors duration-300',
          'flex items-center justify-between',
          error
            ? 'border-destructive'
            : 'border-border hover:border-muted-foreground',
          isOpen && 'ring-2 ring-accent ring-offset-2',
        )}
      >
        <span
          className={
            selectedCategory ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {selectedCategory?.nombre ?? 'Selecciona una categoría...'}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            'transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-card shadow-lg">
          <div className="sticky top-0 border-b border-border bg-card p-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                autoFocus
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Cargando categorías...
              </div>
            )}

            {!isLoading &&
              filteredCategories.length > 0 &&
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onChange(category.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={cn(
                    'w-full px-4 py-3 text-left text-sm transition-colors duration-300',
                    value === category.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-secondary',
                  )}
                >
                  <div className="font-medium">{category.nombre}</div>
                  {category.descripcion && (
                    <div className="mt-0.5 text-xs opacity-70">
                      {category.descripcion}
                    </div>
                  )}
                </button>
              ))}

            {!isLoading && filteredCategories.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No se encontraron categorías
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
