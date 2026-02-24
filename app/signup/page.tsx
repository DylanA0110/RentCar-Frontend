import { SignupForm } from '@/shared/components/auth/signup-form';
import Footer from '@/shared/components/landing/Footer';
import Navbar from '@/shared/components/landing/NavBar';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background auth-surface flex items-center justify-center px-4 pb-16 pt-28">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                RentCar
              </h1>
            </Link>
            <h2 className="text-3xl font-semibold text-foreground mb-2">
              Crear Cuenta
            </h2>
            <p className="text-muted-foreground">
              Únete a miles de clientes satisfechos
            </p>
          </div>

          {/* Form Card */}
          <div className="card-premium shadow-lg">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
