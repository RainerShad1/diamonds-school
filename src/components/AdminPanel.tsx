'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Solicitud = {
  id: string;
  codigo: string;
  nombreEstudiante: string;
  fechaNacimiento: string;
  nivel: string;
  nombreTutor: string;
  telefono: string;
  email: string;
  mensaje: string | null;
  estado: 'PENDIENTE' | 'EN_REVISION' | 'APROBADA' | 'RECHAZADA';
  observaciones: string | null;
  creadaEn: string;
};

type Imagen = { id: string; titulo: string; descripcion: string | null; imagen: string; creadaEn: string };
type Post = { id: string; titulo: string; contenido: string; creadaEn: string };

const ESTADOS: Solicitud['estado'][] = ['PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA'];
const ESTADO_LABEL: Record<Solicitud['estado'], string> = {
  PENDIENTE: 'Pendiente',
  EN_REVISION: 'En revisión',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
};
const ESTADO_COLOR: Record<Solicitud['estado'], string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  EN_REVISION: 'bg-blue-100 text-blue-800',
  APROBADA: 'bg-green-100 text-green-800',
  RECHAZADA: 'bg-red-100 text-red-700',
};

type Tab = 'solicitudes' | 'galeria' | 'publicaciones';

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('solicitudes');

  async function salir() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ice">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="flex items-center gap-2 font-display text-lg">
            <span className="diamond" aria-hidden /> Panel administrativo
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" className="text-white/70 transition hover:text-white">Ver página</a>
            <button onClick={salir} className="rounded-md border border-white/30 px-3 py-1.5 transition hover:bg-white/10">
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-4">
          {(['solicitudes', 'galeria', 'publicaciones'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-md px-4 py-2 text-sm capitalize transition ${
                tab === t ? 'bg-ice font-medium text-navy' : 'text-white/70 hover:text-white'
              }`}
            >
              {t === 'galeria' ? 'Galería' : t}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {tab === 'solicitudes' && <Solicitudes />}
        {tab === 'galeria' && <GaleriaAdmin />}
        {tab === 'publicaciones' && <Publicaciones />}
      </div>
    </main>
  );
}

/* ------------------------- SOLICITUDES ------------------------- */

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [abierta, setAbierta] = useState<Solicitud | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const res = await fetch('/api/inscripciones');
    if (res.ok) setSolicitudes(await res.json());
    setCargando(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const filtradas = solicitudes.filter((s) => {
    const q = busqueda.toLowerCase();
    const coincide =
      !q ||
      s.nombreEstudiante.toLowerCase().includes(q) ||
      s.nombreTutor.toLowerCase().includes(q) ||
      s.codigo.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    const estadoOk = filtroEstado === 'TODAS' || s.estado === filtroEstado;
    return coincide && estadoOk;
  });

  const stats = ESTADOS.map((e) => ({ estado: e, total: solicitudes.filter((s) => s.estado === e).length }));

  async function actualizar(id: string, data: Partial<Pick<Solicitud, 'estado' | 'observaciones'>>) {
    const res = await fetch(`/api/inscripciones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const actualizada: Solicitud = await res.json();
      setSolicitudes((prev) => prev.map((s) => (s.id === id ? actualizada : s)));
      setAbierta((prev) => (prev?.id === id ? actualizada : prev));
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta solicitud? Esta acción no se puede deshacer.')) return;
    const res = await fetch(`/api/inscripciones/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      setAbierta(null);
    }
  }

  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.estado} className="card">
            <p className="text-xs uppercase tracking-wide text-ink/50">{ESTADO_LABEL[s.estado]}s</p>
            <p className="mt-1 font-display text-2xl text-navy">{s.total}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por estudiante, tutor, código o correo…"
          className="input sm:max-w-sm"
        />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="input sm:w-48">
          <option value="TODAS">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p className="mt-8 text-ink/60">Cargando solicitudes…</p>
      ) : filtradas.length === 0 ? (
        <p className="mt-8 text-ink/60">No hay solicitudes que coincidan.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-navy/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Estudiante</th>
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Tutor</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setAbierta(s)}
                  className="cursor-pointer border-b border-navy/5 transition last:border-0 hover:bg-ice/60"
                >
                  <td className="px-4 py-3 font-mono text-xs">{s.codigo}</td>
                  <td className="px-4 py-3 font-medium text-navy">{s.nombreEstudiante}</td>
                  <td className="px-4 py-3">{s.nivel}</td>
                  <td className="px-4 py-3">{s.nombreTutor}</td>
                  <td className="px-4 py-3">{new Date(s.creadaEn).toLocaleDateString('es-DO')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_COLOR[s.estado]}`}>
                      {ESTADO_LABEL[s.estado]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {abierta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4"
          onClick={() => setAbierta(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-full w-full max-w-lg overflow-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-ink/50">{abierta.codigo}</p>
                <h3 className="font-display text-xl text-navy">{abierta.nombreEstudiante}</h3>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_COLOR[abierta.estado]}`}>
                {ESTADO_LABEL[abierta.estado]}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div><dt className="text-xs text-ink/50">Nivel</dt><dd>{abierta.nivel}</dd></div>
              <div><dt className="text-xs text-ink/50">Nacimiento</dt><dd>{abierta.fechaNacimiento}</dd></div>
              <div><dt className="text-xs text-ink/50">Tutor</dt><dd>{abierta.nombreTutor}</dd></div>
              <div><dt className="text-xs text-ink/50">Teléfono</dt><dd>{abierta.telefono}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-ink/50">Correo</dt><dd className="break-all">{abierta.email}</dd></div>
              {abierta.mensaje && (
                <div className="col-span-2"><dt className="text-xs text-ink/50">Mensaje</dt><dd className="whitespace-pre-line">{abierta.mensaje}</dd></div>
              )}
              <div className="col-span-2">
                <dt className="text-xs text-ink/50">Recibida</dt>
                <dd>{new Date(abierta.creadaEn).toLocaleString('es-DO')}</dd>
              </div>
            </dl>

            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium">Cambiar estado</span>
              <select
                value={abierta.estado}
                onChange={(e) => actualizar(abierta.id, { estado: e.target.value as Solicitud['estado'] })}
                className="input"
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
                ))}
              </select>
            </label>

            <ObservacionesEditor
              key={abierta.id}
              inicial={abierta.observaciones ?? ''}
              onGuardar={(texto) => actualizar(abierta.id, { observaciones: texto })}
            />

            <div className="mt-5 flex justify-between">
              <button onClick={() => eliminar(abierta.id)} className="text-sm text-red-600 underline">
                Eliminar solicitud
              </button>
              <button onClick={() => setAbierta(null)} className="text-sm text-sapphire underline">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ObservacionesEditor({ inicial, onGuardar }: { inicial: string; onGuardar: (t: string) => void }) {
  const [texto, setTexto] = useState(inicial);
  const [guardado, setGuardado] = useState(false);

  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-medium">Observaciones</span>
      <textarea value={texto} onChange={(e) => { setTexto(e.target.value); setGuardado(false); }} rows={3} className="input" />
      <button
        type="button"
        onClick={() => { onGuardar(texto); setGuardado(true); }}
        className="mt-2 rounded-md bg-navy px-3 py-1.5 text-sm text-white transition hover:bg-navy/90"
      >
        {guardado ? 'Guardado ✓' : 'Guardar observaciones'}
      </button>
    </label>
  );
}

/* ------------------------- GALERIA ------------------------- */

function GaleriaAdmin() {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    const res = await fetch('/api/galeria');
    if (res.ok) setImagenes(await res.json());
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  function leerArchivo(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = () => rej(new Error('No se pudo leer la imagen'));
      r.readAsDataURL(file);
    });
  }

  async function subir(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!archivo) return;
    setError('');
    if (archivo.size > 2 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 2MB.');
      return;
    }
    setSubiendo(true);
    try {
      const imagen = await leerArchivo(archivo);
      const res = await fetch('/api/galeria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion, imagen }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'No se pudo subir la imagen');
      } else {
        setImagenes((prev) => [json, ...prev]);
        setTitulo('');
        setDescripcion('');
        setArchivo(null);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setError('Error al subir la imagen');
    } finally {
      setSubiendo(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    const res = await fetch(`/api/galeria/${id}`, { method: 'DELETE' });
    if (res.ok) setImagenes((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <form onSubmit={subir} className="card h-fit">
        <h3 className="font-display text-lg text-navy">Subir imagen</h3>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Título *</span>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required maxLength={100} className="input" />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium">Descripción</span>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} maxLength={300} className="input" />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium">Imagen * (máx. 2MB)</span>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-2 file:text-sm file:text-white"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={subiendo} className="btn-gold mt-4 w-full disabled:opacity-60">
          {subiendo ? 'Subiendo…' : 'Publicar imagen'}
        </button>
      </form>

      <div>
        {imagenes.length === 0 ? (
          <p className="text-ink/60">Aún no hay imágenes. Sube la primera con el formulario.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {imagenes.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-xl border border-navy/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imagen} alt={img.titulo} className="aspect-square w-full object-cover" />
                <div className="p-2.5">
                  <p className="truncate text-sm font-medium text-navy">{img.titulo}</p>
                  {img.descripcion && <p className="truncate text-xs text-ink/60">{img.descripcion}</p>}
                </div>
                <button
                  onClick={() => eliminar(img.id)}
                  className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------- PUBLICACIONES ------------------------- */

function Publicaciones() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    const res = await fetch('/api/publicaciones');
    if (res.ok) setPosts(await res.json());
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function publicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    const res = await fetch('/api/publicaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, contenido }),
    });
    const json = await res.json();
    setGuardando(false);
    if (!res.ok) {
      setError(json.error || 'No se pudo publicar');
    } else {
      setPosts((prev) => [json, ...prev]);
      setTitulo('');
      setContenido('');
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta publicación?')) return;
    const res = await fetch(`/api/publicaciones/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <form onSubmit={publicar} className="card h-fit">
        <h3 className="font-display text-lg text-navy">Nueva publicación</h3>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Título *</span>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required maxLength={120} className="input" />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium">Contenido *</span>
          <textarea value={contenido} onChange={(e) => setContenido(e.target.value)} required rows={5} maxLength={2000} className="input" />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={guardando} className="btn-gold mt-4 w-full disabled:opacity-60">
          {guardando ? 'Publicando…' : 'Publicar'}
        </button>
      </form>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-ink/60">Aún no hay publicaciones.</p>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <time className="text-xs uppercase tracking-wide text-gold">
                    {new Date(p.creadaEn).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                  <h3 className="mt-0.5 font-display text-lg text-navy">{p.titulo}</h3>
                </div>
                <button onClick={() => eliminar(p.id)} className="shrink-0 text-sm text-red-600 underline">
                  Eliminar
                </button>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">{p.contenido}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
