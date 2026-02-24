'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import heroImage from '@/public/assets/hero-car.jpg';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] overflow-hidden bg-background pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 500px at 15% -10%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(900px 400px at 85% 10%, rgba(0,0,0,0.05), transparent 60%)',
        }}
      />

      <div className="container mx-auto relative z-10 grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-semibold tracking-[0.2em] uppercase border border-border rounded-full text-foreground">
            premium · flexible · inmediato
          </span>

          <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-[1.05] mb-6">
            Tu auto premium,
            <span className="block">listo cuando tu digas.</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Renta con proceso claro y entrega puntual. Selecciona, reserva y
            disfruta sin fricciones.
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
              Ver Catalogo
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span>Entrega 24/7</span>
            <span>Seguro incluido</span>
            <span>Cancelacion flexible</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-foreground/5 to-transparent" />
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              className="relative rounded-[28px] border border-border bg-card/70 p-6 shadow-2xl backdrop-blur"
            >
              <Image
                src={heroImage}
                alt="Vehiculo premium de alquiler"
                className="w-full h-auto object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
