'use client';

import { useMemo, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    name: 'María González',
    text: 'Servicio impecable. Todo fue rápido y sin complicaciones. Volvería sin dudarlo.',
    avatar: 'MG',
  },
  {
    name: 'Carlos Ramírez',
    text: 'La mejor experiencia de alquiler que he tenido. Vehículo en perfectas condiciones.',
    avatar: 'CR',
  },
  {
    name: 'Ana Torres',
    text: 'Profesionales y puntuales. Repetiré sin duda. Excelente atención al cliente.',
    avatar: 'AT',
  },
  {
    name: 'Diego Fernández',
    text: 'Proceso de reserva muy intuitivo. En minutos ya tenía mi auto listo.',
    avatar: 'DF',
  },
  {
    name: 'Laura Méndez',
    text: 'Calidad premium a un precio justo. Los vehículos están impecables.',
    avatar: 'LM',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useMemo(() => testimonials[activeIndex], [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Voces que respaldan nuestra calidad
            </h2>
            <p className="text-muted-foreground">
              Opiniones reales, servicio premium y una experiencia que se nota.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={handlePrev}
              className="testimonial-nav"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="testimonial-nav"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="testimonial-card"
            >
              <span className="testimonial-card__title">Testimonio</span>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <p className="testimonial-card__content">"{active.text}"</p>
              <div className="testimonial-card__meta">
                <div className="testimonial-avatar">{active.avatar}</div>
                <span className="text-sm font-semibold text-foreground">
                  {active.name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
          <button
            onClick={handlePrev}
            className="testimonial-nav"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-xs text-muted-foreground">
            {activeIndex + 1} / {testimonials.length}
          </div>
          <button
            onClick={handleNext}
            className="testimonial-nav"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
