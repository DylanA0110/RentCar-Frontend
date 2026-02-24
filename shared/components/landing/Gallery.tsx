'use client';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import gallery1 from '@/public/assets/gallery-1.jpg';
import gallery2 from '@/public/assets/gallery-2.jpg';
import gallery3 from '@/public/assets/gallery-3.jpg';
import gallery4 from '@/public/assets/gallery-4.jpg';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

const images = [
  { src: gallery1, alt: 'Showroom de vehículos premium' },
  { src: gallery2, alt: 'SUV en carretera costera' },
  { src: gallery3, alt: 'Interior de lujo' },
  { src: gallery4, alt: 'Deportivo en la ciudad' },
];

const Gallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Galería
          </h2>
          <p className="text-muted-foreground">
            Una mirada a nuestra experiencia premium.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="min-w-[70%] md:min-w-[50%] shrink-0 px-2"
                >
                  <div className="aspect-2/1 rounded-2xl overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selected === i ? 'bg-foreground w-6' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
