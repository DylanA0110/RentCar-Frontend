import Footer from '@/shared/components/landing/Footer';
import Navbar from '@/shared/components/landing/NavBar';
import CatalogClient from '../../shared/components/catalog/CatalogClient';

const Catalog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CatalogClient />
      <Footer />
    </div>
  );
};

export default Catalog;
