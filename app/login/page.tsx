import { LoginForm } from '@/shared/components/auth/login-form';
import Footer from '@/shared/components/landing/Footer';
import Navbar from '@/shared/components/landing/NavBar';
import Link from 'next/link';

export default function LoginPage() {
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
              Bienvenido
            </h2>
            <p className="text-muted-foreground">
              Accede a tu cuenta para continuar
            </p>
          </div>

          {/* Form Card */}
          <div className="card-premium shadow-lg">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
