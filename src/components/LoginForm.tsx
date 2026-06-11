'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError('');
    const password = new FormData(e.currentTarget).get('password');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setCargando(false);
    if (res.ok) router.refresh();
    else setError('Contraseña incorrecta');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <form onSubmit={entrar} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <p className="flex items-center gap-2 font-display text-xl text-navy">
          <span className="diamond" aria-hidden /> Panel administrativo
        </p>
        <label className="mt-5 block">
          <span className="mb-1 block text-sm font-medium text-ink">Contraseña</span>
          <input name="password" type="password" required autoFocus className="input" />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={cargando} className="btn-gold mt-5 w-full disabled:opacity-60">
          {cargando ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
