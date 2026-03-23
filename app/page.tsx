import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Benefits from '@/shared/components/landing/Benefits';
import CatalogPreview from '@/shared/components/landing/CatalogPreview';
import CTASection from '@/shared/components/landing/CTASection';
import Footer from '@/shared/components/landing/Footer';
import Gallery from '@/shared/components/landing/Gallery';
import HeroSection from '@/shared/components/landing/HeroSection';
import HowItWorks from '@/shared/components/landing/HowItWorks';
import LocationSection from '@/shared/components/landing/LocationSection';
import Navbar from '@/shared/components/landing/NavBar';
import Testimonials from '@/shared/components/landing/Testimonial';
import { getVehiculosPublicISR } from '@/modules/vehiculos/actions/get-vehiculos-public-isr';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['vehiculos', 'public'],
    queryFn: () => getVehiculosPublicISR(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CatalogPreview />
      </HydrationBoundary>
      <HowItWorks />
      <LocationSection />
      <Benefits />
      <Gallery />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
