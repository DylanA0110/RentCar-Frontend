'use client';

import { DataTable } from '@/shared/components/ui/data-table';
import { MetricCard } from '@/shared/components/ui/metric-card';
import { DollarSign, Car, Users, Zap, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function DashboardHome() {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(
    null,
  );

  const reservationColumns = [
    { key: 'vehicleName', label: 'Vehículo' },
    { key: 'customerName', label: 'Cliente' },
    { key: 'startDate', label: 'Inicio' },
    { key: 'endDate', label: 'Fin' },
    { key: 'totalPrice', label: 'Precio', width: 'w-20' },
    { key: 'status', label: 'Estado' },
  ];

  const dashboardMetrics = {
    totalRevenue: 128450,
    revenueChange: 12.4,
    activeReservations: 42,
    reservationsChange: 6.1,
    totalCustomers: 1280,
    customersChange: 3.8,
    availableVehicles: 86,
    vehiclesChange: -4.2,
  };

  const reservations = [
    {
      id: 'res-1001',
      vehicleName: 'BMW X5 2024',
      customerName: 'Ana Perez',
      startDate: '12 Feb, 2026',
      endDate: '15 Feb, 2026',
      totalPrice: 420,
      status: 'active',
    },
    {
      id: 'res-1002',
      vehicleName: 'Audi A4 2023',
      customerName: 'Carlos Diaz',
      startDate: '10 Feb, 2026',
      endDate: '13 Feb, 2026',
      totalPrice: 260,
      status: 'confirmed',
    },
    {
      id: 'res-1003',
      vehicleName: 'Tesla Model 3',
      customerName: 'Laura Gomez',
      startDate: '08 Feb, 2026',
      endDate: '11 Feb, 2026',
      totalPrice: 390,
      status: 'pending',
    },
    {
      id: 'res-1004',
      vehicleName: 'Toyota Corolla',
      customerName: 'Miguel Ruiz',
      startDate: '05 Feb, 2026',
      endDate: '07 Feb, 2026',
      totalPrice: 140,
      status: 'completed',
    },
  ];

  const formattedReservations = reservations.map((r) => ({
    ...r,
    totalPrice: `$${r.totalPrice}`,
    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          r.status === 'active'
            ? 'bg-accent/10 text-accent'
            : r.status === 'confirmed'
              ? 'bg-green-100 text-green-700'
              : r.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
        }`}
      >
        {r.status === 'active'
          ? 'Activa'
          : r.status === 'confirmed'
            ? 'Confirmada'
            : r.status === 'pending'
              ? 'Pendiente'
              : 'Completada'}
      </span>
    ),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="heading-2 text-foreground mb-2">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta a tu gestor de flota premium
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          label="Ingresos Totales"
          value={`$${dashboardMetrics.totalRevenue.toLocaleString()}`}
          change={dashboardMetrics.revenueChange}
          changeType="increase"
        />
        <MetricCard
          icon={Car}
          label="Reservas Activas"
          value={dashboardMetrics.activeReservations}
          change={dashboardMetrics.reservationsChange}
          changeType="increase"
        />
        <MetricCard
          icon={Users}
          label="Clientes Totales"
          value={dashboardMetrics.totalCustomers}
          change={dashboardMetrics.customersChange}
          changeType="increase"
        />
        <MetricCard
          icon={Zap}
          label="Vehículos Disponibles"
          value={dashboardMetrics.availableVehicles}
          change={Math.abs(dashboardMetrics.vehiclesChange)}
          changeType={
            dashboardMetrics.vehiclesChange < 0 ? 'decrease' : 'increase'
          }
        />
      </div>

      {/* Recent Reservations Table */}
      <div className="card-premium">
        <div className="mb-6">
          <h3 className="heading-3 text-foreground mb-1">Reservas Recientes</h3>
          <p className="text-sm text-muted-foreground">
            Todas las reservas de los últimos 30 días
          </p>
        </div>

        <DataTable
          columns={reservationColumns}
          rows={formattedReservations}
          onRowClick={(row) => setSelectedReservation(row.id)}
          actions={(row) => (
            <button className="p-2 hover:bg-secondary rounded-lg transition-smooth">
              <MoreHorizontal size={18} className="text-foreground" />
            </button>
          )}
        />
      </div>
    </div>
  );
}
