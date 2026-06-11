import { prisma } from '@/lib/prisma';
import { school, niveles } from '@/lib/config';
import Galeria from '@/components/Galeria';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [imagenes, publicaciones] = await Promise.all([
    prisma.imagenGaleria.findMany({ orderBy: { creadaEn: 'desc' }, take: 12 }).catch(() => []),
    prisma.publicacion.findMany({ orderBy: { creadaEn: 'desc' }, take: 6 }).catch(() => []),
  ]);

  return (
    <main>
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#inicio" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-transparente.png" alt="" className="h-9 w-auto rounded-full bg-white p-0.5" />
            <span className="font-display text-base text-white sm:text-lg">{school.name}</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            <a className="transition hover:text-white" href="#nosotros">Nosotros</a>
            <a className="transition hover:text-white" href="#galeria">Galería</a>
            <a className="transition hover:text-white" href="#noticias">Noticias</a>
            <a className="transition hover:text-white" href="#contacto">Contacto</a>
          </nav>
          <a href="/formulario" className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-navy transition hover:brightness-110">
            Inscríbete
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rotate-45 rounded-3xl border border-gold/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-32 h-64 w-64 rotate-45 rounded-2xl border border-sapphire/40"
        />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-transparente.png" alt={school.name} className="mb-6 h-28 w-auto rounded-2xl bg-white/95 p-3 md:h-32" />
          <p className="mb-4 flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-gold">
            <span className="diamond" aria-hidden /> Inscripciones abiertas
          </p>
          <h1 className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">
            {school.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{school.slogan}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/formulario" className="btn-gold">Iniciar inscripción</a>
            <a href="#contacto" className="btn-outline">Contáctanos</a>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="section-title flex items-center gap-3">
          <span className="diamond" aria-hidden /> Sobre nosotros
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="font-display text-xl text-navy">Misión</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Formar estudiantes íntegros, con valores sólidos y las herramientas
              académicas necesarias para destacar en un mundo en constante cambio.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-xl text-navy">Visión</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Ser un referente educativo en la región, reconocidos por la excelencia
              académica y la formación humana de nuestros egresados.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-xl text-navy">Valores</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Respeto, responsabilidad, honestidad, disciplina y compromiso con la
              comunidad.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {niveles.map((nivel) => (
            <div key={nivel} className="card border-t-2 border-t-gold">
              <span className="diamond mb-3" aria-hidden />
              <h3 className="font-display text-lg text-navy">{nivel}</h3>
              <p className="mt-1 text-sm text-ink/60">
                Programa académico completo con docentes calificados.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title flex items-center gap-3">
            <span className="diamond" aria-hidden /> Galería
          </h2>
          <Galeria imagenes={imagenes} />
        </div>
      </section>

      {/* NOTICIAS */}
      <section id="noticias" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="section-title flex items-center gap-3">
          <span className="diamond" aria-hidden /> Noticias y avisos
        </h2>
        {publicaciones.length === 0 ? (
          <p className="mt-6 text-ink/60">Pronto publicaremos novedades.</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publicaciones.map((p) => (
              <article key={p.id} className="card">
                <time className="text-xs uppercase tracking-wide text-gold">
                  {new Date(p.creadaEn).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <h3 className="mt-1 font-display text-lg text-navy">{p.titulo}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">{p.contenido}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* INSCRIPCION */}
      <section id="inscripcion" className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="flex items-center justify-center gap-3 font-display text-3xl md:text-4xl">
            <span className="diamond" aria-hidden /> Inscripciones abiertas
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Completa el formulario de admisión en línea. Recibirás un código de
            solicitud y nuestro equipo te contactará para continuar el proceso.
          </p>
          <ul className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><span className="diamond" aria-hidden /> Respuesta en 24–48 horas</li>
            <li className="flex items-center gap-2"><span className="diamond" aria-hidden /> Proceso 100% guiado</li>
            <li className="flex items-center gap-2"><span className="diamond" aria-hidden /> Cupos limitados por nivel</li>
          </ul>
          <a href="/formulario" className="btn-gold mt-8">Envía tu inscripción aquí</a>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="section-title flex items-center gap-3">
          <span className="diamond" aria-hidden /> Contacto
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="card transition hover:border-gold">
            <p className="text-xs uppercase tracking-wide text-ink/50">Teléfono</p>
            <p className="mt-1 font-medium text-navy">{school.phone}</p>
          </a>
          <a
            href={`https://wa.me/${school.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card transition hover:border-gold"
          >
            <p className="text-xs uppercase tracking-wide text-ink/50">WhatsApp</p>
            <p className="mt-1 font-medium text-navy">Escríbenos</p>
          </a>
          <a href={`mailto:${school.email}`} className="card transition hover:border-gold">
            <p className="text-xs uppercase tracking-wide text-ink/50">Correo</p>
            <p className="mt-1 break-all font-medium text-navy">{school.email}</p>
          </a>
          <div className="card">
            <p className="text-xs uppercase tracking-wide text-ink/50">Dirección</p>
            <p className="mt-1 font-medium text-navy">{school.address}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-navy py-8 text-center text-sm text-white/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-transparente.png" alt="" className="mx-auto mb-3 h-12 w-auto rounded-full bg-white p-1" />
        <p>{school.name}</p>
        <p className="mt-2">© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
