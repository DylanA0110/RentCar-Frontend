'use client';

const SHARED_LOCATION_URL = 'https://share.google/uNeXUWnYQFQ206DAa';

const LocationSection = () => {
  return (
    <section className="py-16 bg-section-alt/35">
      <div className="container mx-auto">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Nuestra ubicación
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Encuéntranos fácilmente y agenda tu visita para retirar tu vehículo.
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <iframe
            title="Ubicación de Huber Renta Car"
            src="https://www.google.com/maps?q=Huber%20Renta%20Car&output=embed"
            width="100%"
            height="260"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
          <div className="flex flex-col items-center justify-between gap-2 border-t border-border px-5 py-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
              Huber Renta Car · servicio rápido y atención personalizada.
            </p>
            <a
              href={SHARED_LOCATION_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-accent hover:underline whitespace-nowrap"
            >
              Abrir ubicación exacta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
