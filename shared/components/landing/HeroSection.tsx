'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import heroImage from '@/public/assets/hero-car.jpg';
import Link from 'next/link';
import { Sora } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const HeroSection = () => {
  const fallbackHeroSrc = heroImage.src;
  const preferredHiluxSrc = '/assets/hilux.jpg';
  const [heroSrc, setHeroSrc] = useState(preferredHiluxSrc);

  const resolvedHeroSrc = useMemo(
    () => heroSrc || fallbackHeroSrc,
    [heroSrc, fallbackHeroSrc],
  );

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

          <h1
            className={`${sora.className} text-3xl md:text-5xl font-bold text-foreground leading-[0.98] mb-6`}
          >
            LOS MEJORES EN RENTA DE VEHÍCULOS
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Hacemos que tus viajes sean memorables con los mejores precios y
            descuentos.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 h-12 text-base transition-transform hover:scale-105"
            >
              <Link href="/catalog">Reservar Ahora</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 h-12 text-base"
            >
              <Link href="#catalogo">Ver Catalogo</Link>
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
            <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-foreground/5 to-transparent" />
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
              <img
                src={resolvedHeroSrc}
                alt="Vehículo premium de alquiler"
                className="w-full h-auto object-cover"
                loading="eager"
                onError={() => setHeroSrc(fallbackHeroSrc)}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
