'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          RentCar
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/catalog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>
          {isHome && (
            <a
              href="#como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reservar
            </a>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Iniciar Sesión
          </Button>
          <Button variant="outline" size="sm">
            Registrarse
          </Button>
          <Link href="/catalogo">
            <Button size="sm">Reservar Ahora</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-background border-b border-border px-6 pb-6 pt-2"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                Catálogo
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" size="sm" className="justify-start">
                  Iniciar Sesión
                </Button>
                <Button variant="outline" size="sm">
                  Registrarse
                </Button>
                <Link href="/catalogo" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">
                    Reservar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
