'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Headphones, Sparkles } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Seguro incluido',
    desc: 'Viaja con total tranquilidad. Todos nuestros vehículos cuentan con cobertura completa para protegerte en cada kilómetro de tu aventura.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: CreditCard,
    title: 'Pagos flexibles',
    desc: 'Adaptamos las opciones a tu comodidad. Aceptamos múltiples métodos de pago, tarjetas de crédito, débito y transferencias seguras.',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    desc: 'Nunca estarás solo en el camino. Nuestro equipo de asistencia está disponible las 24 horas, los 7 días de la semana para ayudarte.',
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: Sparkles,
    title: 'Vehículos impecables',
    desc: 'Garantizamos los más altos estándares. Cada vehículo pasa por una rigurosa limpieza y mantenimiento premium antes de ser entregado.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
];

const Benefits = () => {
  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Descubre las ventajas exclusivas que hacen de nuestra flota la mejor
            opción para tu próximo destino.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Línea curva central SVG */}
          <svg
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            viewBox="0 0 600 1200"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M300 0 C 400 200, 200 400, 300 600 S 400 1000, 300 1200"
              stroke="#111"
              strokeWidth="4"
              strokeDasharray="10 18"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </svg>

          {benefits.map((b, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 60, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.18 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  type: 'spring',
                  stiffness: 180,
                  damping: 22,
                }}
                whileHover={{ y: -8, scale: 1.015 }}
                className={`relative mb-14 flex ${isEven ? 'justify-start' : 'justify-end'}`}
              >
                {/* Punto de conexión */}
                <div
                  className={`absolute -top-4 ${isEven ? 'left-[15%]' : 'right-[15%]'} z-30`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-lg opacity-60 bg-primary" />
                    <div className="relative w-7 h-7 rounded-full border-2 border-primary/40 flex items-center justify-center shadow-xl bg-primary">
                      <div className="w-3 h-3 rounded-full bg-background" />
                    </div>
                  </div>
                </div>

                {/* Card moderna y limpia */}
                <motion.div
                  className={`bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-[80%] md:w-[46%] ${isEven ? 'ml-0 sm:ml-[0%] md:ml-[0%]' : 'mr-0 sm:mr-[0%] md:mr-[0%]'}`}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    borderColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-primary/10 border border-primary">
                        <b.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        {b.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
