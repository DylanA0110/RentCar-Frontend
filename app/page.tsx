import Benefits from '@/shared/components/landing/Benefits';
import CatalogPreview from '@/shared/components/landing/CatalogPreview';
import CTASection from '@/shared/components/landing/CTASection';
import Footer from '@/shared/components/landing/Footer';
import Gallery from '@/shared/components/landing/Gallery';
import HeroSection from '@/shared/components/landing/HeroSection';
import HowItWorks from '@/shared/components/landing/HowItWorks';
import Navbar from '@/shared/components/landing/NavBar';
import Testimonials from '@/shared/components/landing/Testimonial';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CatalogPreview />
      <HowItWorks />
      <Benefits />
      <Gallery />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
