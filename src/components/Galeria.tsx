'use client';

import { useState } from 'react';

type Imagen = { id: string; titulo: string; descripcion: string | null; imagen: string };

export default function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const [activa, setActiva] = useState<Imagen | null>(null);

  if (imagenes.length === 0) {
    return <p className="mt-6 text-ink/60">Aún no hay fotos publicadas.</p>;
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {imagenes.map((img) => (
          <button
            key={img.id}
            onClick={() => setActiva(img)}
            className="group relative overflow-hidden rounded-xl border border-navy/10 bg-ice text-left focus:outline-none focus:ring-2 focus:ring-sapphire"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.imagen}
              alt={img.titulo}
              loading="lazy"
              className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-3 pt-8">
              <p className="text-sm font-medium text-white">{img.titulo}</p>
            </div>
          </button>
        ))}
      </div>

      {activa && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
          onClick={() => setActiva(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activa.titulo}
        >
          <div className="max-h-full max-w-3xl overflow-auto rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activa.imagen} alt={activa.titulo} className="max-h-[70vh] w-full object-contain bg-ice" />
            <div className="p-4">
              <h3 className="font-display text-xl text-navy">{activa.titulo}</h3>
              {activa.descripcion && <p className="mt-1 text-sm text-ink/70">{activa.descripcion}</p>}
              <button onClick={() => setActiva(null)} className="mt-3 text-sm text-sapphire underline">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
