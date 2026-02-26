import VehicleReservationClient from '@/shared/components/catalog/VehicleReservationClient';
import Footer from '@/shared/components/landing/Footer';
import Navbar from '@/shared/components/landing/NavBar';

interface VehicleReservationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VehicleReservationPage({
  params,
}: VehicleReservationPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <VehicleReservationClient vehicleId={id} />
      <Footer />
    </div>
  );
}
