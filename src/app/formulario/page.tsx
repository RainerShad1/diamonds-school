import Link from 'next/link';
import { school } from '@/lib/config';
import InscripcionForm from '@/components/InscripcionForm';

export const metadata = {
  title: `Inscripción — ${school.name}`,
  description: `Formulario de inscripción de ${school.name}.`,
};

export default function FormularioPage() {
  return (
    <main className="min-h-screen bg-ice">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-transparente.png" alt="" className="h-9 w-auto rounded-full bg-white p-0.5" />
            <span className="font-display text-base sm:text-lg">{school.name}</span>
          </Link>
          <Link href="/" className="text-sm text-white/70 transition hover:text-white">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-gold">
          <span className="diamond" aria-hidden /> Proceso de admisión
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy md:text-4xl">
          Formulario de inscripción
        </h1>
        <p className="mt-3 max-w-xl text-ink/70">
          Completa los datos del estudiante y del padre o tutor. Al enviar la
          solicitud recibirás un código único para dar seguimiento al proceso.
          Nuestro equipo te contactará en un plazo de 24 a 48 horas.
        </p>

        <div className="mt-8">
          <InscripcionForm />
        </div>

        <div className="mt-8 rounded-xl border border-navy/10 bg-white p-5 text-sm text-ink/70">
          <h2 className="font-display text-lg text-navy">Información importante</h2>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="diamond mt-1.5 shrink-0" aria-hidden />
              El envío del formulario no garantiza el cupo; es el primer paso del proceso de admisión.
            </li>
            <li className="flex items-start gap-2">
              <span className="diamond mt-1.5 shrink-0" aria-hidden />
              Guarda el código de solicitud que recibirás al enviar.
            </li>
            <li className="flex items-start gap-2">
              <span className="diamond mt-1.5 shrink-0" aria-hidden />
              Para cualquier duda, contáctanos por WhatsApp o al teléfono del centro.
            </li>
          </ul>
        </div>
      </div>

      <footer className="border-t border-white/10 bg-navy py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {school.name}
      </footer>
    </main>
  );
}
