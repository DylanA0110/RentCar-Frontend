const Footer = () => {
  return (
    <footer className="py-6 bg-section-alt border-t border-border">
      <div className="container mx-auto">
        <div className="mb-5 flex justify-center md:justify-start">
          <img
            src="/assets/Logo_huber_Renta_car-removebg-preview.png"
            alt="Huber Renta Car"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wide">
              Empresa
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Carreras
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wide">
              Soporte
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Términos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wide">
              Redes
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-[11px] text-muted-foreground text-center">
            © 2026 RentCar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
