'use client'

import { CRUDList } from '@/shared/components/admin/crud-list'
import { useState } from 'react'

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@rentcar.com',
    role: 'Administrador',
    status: 'activo',
  },
  {
    id: '2',
    name: 'Gerente de Flota',
    email: 'fleet@rentcar.com',
    role: 'Gerente',
    status: 'activo',
  },
  {
    id: '3',
    name: 'Soporte Técnico',
    email: 'support@rentcar.com',
    role: 'Soporte',
    status: 'activo',
  },
]

export default function UsersPage() {
  const [userList] = useState(mockUsers)

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rol' },
    { key: 'status', label: 'Estado' },
  ]

  const formattedUsers = userList.map(u => ({
    ...u,
    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          u.status === 'activo'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {u.status === 'activo' ? 'Activo' : 'Inactivo'}
      </span>
    ),
  }))

  const handleEdit = (id: string) => {
    console.log('Edit user:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete user:', id)
  }

  return (
    <CRUDList
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema"
      createHref="/dashboard/users/new"
      columns={columns}
      rows={formattedUsers}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
