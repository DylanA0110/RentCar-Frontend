'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';

const vehicles = [
  {
    name: 'Sedán Ejecutivo',
    category: 'Sedán',
    price: '$45/día',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
  },
  {
    name: 'SUV Premium',
    category: 'SUV',
    price: '$65/día',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop',
  },
  {
    name: 'Coupé Deportivo',
    category: 'Deportivo',
    price: '$85/día',
    image:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
  },
];

const CatalogPreview = () => {
  return (
    <section id="catalogo" className="py-24 bg-section-alt">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Nuestra Flota
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Vehículos seleccionados para cada ocasión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-border/50"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  {v.category}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {v.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-medium text-foreground">
                    {v.price}
                  </span>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Reservar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/catalogo">
            <Button variant="outline" size="lg" className="rounded-2xl px-8">
              Ver todo el catálogo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CatalogPreview;
