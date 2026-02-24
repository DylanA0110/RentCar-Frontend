'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Reserva hoy mismo tu próximo viaje.
          </h2>
          <p className="text-primary-foreground/70 mb-10">
            Todo listo para salir. Sin complicaciones.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-2xl px-8 h-12 text-base transition-transform hover:scale-105"
          >
            Reservar Ahora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
