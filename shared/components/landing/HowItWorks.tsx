'use client';

import { motion } from 'framer-motion';
import { Car, CalendarDays, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Car,
    title: 'Selecciona vehículo',
    desc: 'Elige entre nuestra flota premium.',
  },
  {
    icon: CalendarDays,
    title: 'Reserva fechas',
    desc: 'Escoge las fechas que necesites.',
  },
  {
    icon: CreditCard,
    title: 'Realiza el pago',
    desc: 'Paga de forma segura y rápida.',
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Cómo Funciona
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tres pasos simples para ponerte en camino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
