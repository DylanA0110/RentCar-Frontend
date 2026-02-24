'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Headphones, Sparkles } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Seguro incluido',
    desc: 'Cobertura total en cada viaje.',
  },
  {
    icon: CreditCard,
    title: 'Pagos flexibles',
    desc: 'Múltiples métodos de pago.',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    desc: 'Siempre disponibles para ti.',
  },
  {
    icon: Sparkles,
    title: 'Vehículos impecables',
    desc: 'Mantenimiento y limpieza premium.',
  },
];

const Benefits = () => {
  return (
    <section className="py-24 bg-section-alt">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <b.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
