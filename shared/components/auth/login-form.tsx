'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Redirect to dashboard (UI-only authentication)
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wide text-foreground mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="h-12 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-300"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wide text-foreground mb-2"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 w-full rounded-lg border border-border bg-background px-4 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-300"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
            defaultChecked
          />
          <span className="text-sm text-muted-foreground">Recordarme</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            O
          </span>
        </div>
      </div>

      {/* Social Auth Buttons */}
      <button
        type="button"
        className="h-12 w-full rounded-lg border border-border font-medium text-foreground hover:bg-secondary transition-all duration-300"
      >
        Continuar con Google
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link
          href="/signup"
          className="text-accent font-semibold hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
