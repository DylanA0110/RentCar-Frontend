'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  Users,
  BookOpen,
  Layers,
  CreditCard,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Vehículos',
    href: '/dashboard/vehicles',
    icon: Car,
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    label: 'Clientes',
    href: '/dashboard/customers',
    icon: BookOpen,
  },
  {
    label: 'Categorías',
    href: '/dashboard/categories',
    icon: Layers,
  },
  {
    label: 'Reservas',
    href: '/dashboard/reservations',
    icon: Car,
  },
  {
    label: 'Pagos',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg hover:bg-secondary transition-colors duration-300"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 w-64 ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } h-screen bg-sidebar border-r border-sidebar-border z-40 transform transition-all duration-300 md:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div
          className={`h-16 flex items-center justify-between border-b border-sidebar-border px-6 ${
            isCollapsed ? 'md:px-3' : 'md:px-6'
          }`}
        >
          <Link
            href="/dashboard"
            className="text-xl font-semibold text-sidebar-foreground"
          >
            {isCollapsed ? 'RC' : 'RentCar'}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sidebar-accent/60 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-6 ${
                  isCollapsed ? 'md:px-0 md:justify-center' : 'md:px-6'
                } py-3 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon size={20} />
                <span className={isCollapsed ? 'inline md:hidden' : 'inline'}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div
          className={`border-t border-sidebar-border p-6 ${
            isCollapsed ? 'md:p-4 md:text-center' : 'md:p-6'
          }`}
        >
          <p className="text-xs text-sidebar-foreground/70">
            {isCollapsed ? 'RC v1.0' : 'RentCar Admin v1.0'}
          </p>
        </div>
      </aside>

      {/* Spacer for Desktop */}
      <div className={`hidden md:block ${isCollapsed ? 'w-20' : 'w-64'}`}></div>
    </>
  );
}
