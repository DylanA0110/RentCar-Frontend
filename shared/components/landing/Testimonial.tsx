'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-muted-foreground">
              Experiencias reales de quienes confían en nosotros.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="min-w-75 md:min-w-90 shrink-0"
              >
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm h-full">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-foreground text-foreground"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                      {t.avatar}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {t.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
