'use client';

import { CRUDList } from '@/shared/components/admin/crud-list';
import { useState } from 'react';

export default function CategoriesPage() {
  const columns = [
    { key: 'name', label: 'Categoría' },
    { key: 'priceRange', label: 'Rango de Precio' },
    { key: 'vehicles', label: 'Vehículos', width: 'w-20' },
  ];

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
      rows={[]}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
