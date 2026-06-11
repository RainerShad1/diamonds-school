'use client';

import { useState } from 'react';
import { niveles } from '@/lib/config';

export default function InscripcionForm() {
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const datos = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json();
      if (!res.ok) {
        setResultado({ ok: false, mensaje: json.error || 'No se pudo enviar la solicitud' });
      } else {
        setResultado({
          ok: true,
          mensaje: `Solicitud recibida. Tu código es ${json.codigo} — guárdalo para dar seguimiento.`,
        });
        form.reset();
      }
    } catch {
      setResultado({ ok: false, mensaje: 'Error de conexión. Intenta de nuevo.' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="rounded-xl bg-white p-6 text-ink shadow-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Nombre del estudiante *</span>
          <input name="nombreEstudiante" required maxLength={120} className="input" placeholder="Nombre completo" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Fecha de nacimiento *</span>
          <input name="fechaNacimiento" type="date" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Nivel *</span>
          <select name="nivel" required className="input" defaultValue="">
            <option value="" disabled>Selecciona un nivel</option>
            {niveles.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Nombre del padre/tutor *</span>
          <input name="nombreTutor" required maxLength={120} className="input" placeholder="Nombre completo" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Teléfono *</span>
          <input name="telefono" type="tel" required maxLength={30} className="input" placeholder="809 000 0000" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Correo electrónico *</span>
          <input name="email" type="email" required maxLength={120} className="input" placeholder="correo@ejemplo.com" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Mensaje (opcional)</span>
          <textarea name="mensaje" rows={3} maxLength={600} className="input" placeholder="¿Algo que debamos saber?" />
        </label>
      </div>

      {resultado && (
        <p
          role="status"
          className={`mt-4 rounded-md px-3 py-2 text-sm ${
            resultado.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
          }`}
        >
          {resultado.mensaje}
        </p>
      )}

      <button type="submit" disabled={enviando} className="btn-gold mt-5 w-full disabled:opacity-60">
        {enviando ? 'Enviando…' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
