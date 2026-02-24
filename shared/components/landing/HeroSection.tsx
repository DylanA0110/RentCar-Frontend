'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import heroImage from '@/public/assets/hero-car.jpg';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-16"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Vehículo premium de alquiler"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="container mx-auto relative z-10 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
            +500 clientes satisfechos
          </span>

          <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-tight mb-6">
            Alquila tu vehículo ideal en minutos.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Reserva rápido, sin complicaciones. Vehículos premium listos para
            ti, cuando y donde los necesites.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-2xl px-8 h-12 text-base transition-transform hover:scale-105"
            >
              Reservar Ahora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 h-12 text-base"
            >
              Ver Catálogo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
