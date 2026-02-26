'use client';

import { useMemo } from 'react';
import { useCategorias } from '@/modules/categorias/hook/useCategorias';
import { CRUDList } from '@/shared/components/admin/crud-list';

export default function CategoriesPage() {
  const { categorias } = useCategorias();

  const columns = [
    { key: 'nombre', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado', width: 'w-32' },
  ];

  const rows = useMemo(
    () =>
      (categorias ?? []).map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion?.trim() || 'Sin descripción',
        estado:
          categoria.estado?.toLowerCase() === 'activo' ? 'Activo' : 'Inactivo',
      })),
    [categorias],
  );

  const handleEdit = (id: string) => {
    console.log('Edit category:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete category:', id);
  };

  return (
    <CRUDList
      title="Gestión de Categorías"
      description="Administra las categorías de vehículos"
      createHref="/dashboard/categories/new"
      columns={columns}
      rows={rows}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
