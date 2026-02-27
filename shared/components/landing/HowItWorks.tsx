'use client';

import { motion } from 'framer-motion';
import { Car, CalendarDays, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Car,
    title: 'Selecciona vehículo',
    desc: 'Elige entre nuestra flota premium con opciones para cada necesidad.',
  },
  {
    icon: CalendarDays,
    title: 'Reserva fechas',
    desc: 'Escoge las fechas que necesites con nuestro calendario flexible.',
  },
  {
    icon: CreditCard,
    title: 'Realiza el pago',
    desc: 'Paga de forma segura y rápida con múltiples métodos de pago.',
  },
];

const HowItWorks = () => {
  return (
    <section
      id="como-funciona"
      className="py-32 bg-background text-foreground overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-28">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Cómo Funciona</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Tres pasos simples para ponerte en camino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-24 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative group h-full"
            >
              {/* Card Inner */}
              <div className="bg-card rounded-2xl px-6 pb-10 pt-20 h-full relative z-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] transition-all duration-500">
                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/40 rounded-2xl transition-colors duration-500 pointer-events-none" />

                {/* Icon Wrapper (Outer Circle) */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-background rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-center z-20 group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

                  {/* Icon Inner (Inner Circle) */}
                  <div className="w-24 h-24 bg-background rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.12)] flex items-center justify-center relative z-30">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mt-4">
                  {/* Title with Counter Pill */}
                  <div className="relative inline-flex items-center justify-center bg-background shadow-[0_10px_25px_rgba(0,0,0,0.08)] rounded-full px-6 py-2.5 mb-6">
                    <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-background shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-center text-foreground font-bold text-base border border-border/50">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold ml-3 text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed px-2">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
