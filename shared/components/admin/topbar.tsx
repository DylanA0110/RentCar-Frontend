'use client';

import { Bell, Settings, LogOut, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Topbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const labelMap: Record<string, string> = {
    dashboard: 'Panel de Control',
    users: 'Usuarios',
    categories: 'Categorias',
    customers: 'Clientes',
    vehicles: 'Vehiculos',
    reservations: 'Reservas',
    payments: 'Pagos',
  };

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    return {
      href,
      label: labelMap[segment] ?? segment,
    };
  });

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background flex items-center">
      <div className="flex-1 flex items-center justify-between px-6">
        {/* Left: Breadcrumbs */}
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight size={14} />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <span className="text-[11px] text-muted-foreground">
            Vista administrativa
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors duration-300">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors duration-300">
            <Settings size={20} className="text-foreground" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-accent">A</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors duration-300"
                >
                  <User size={18} />
                  Mi Perfil
                </Link>
                <hr className="border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors duration-300 text-left"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
