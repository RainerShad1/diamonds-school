type Imagen = { id: string; titulo: string; imagen: string };

export default function HeroDestacadas({ imagenes }: { imagenes: Imagen[] }) {
  if (imagenes.length === 0) return null;
  const [principal, segunda, tercera] = imagenes;

  return (
    <div className="relative hidden min-h-[420px] lg:block" aria-hidden={false}>
      {/* Imagen principal */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={principal.imagen}
        alt={principal.titulo}
        className="absolute right-8 top-1/2 h-[340px] w-[340px] -translate-y-1/2 rotate-2 rounded-2xl border-4 border-white/15 object-cover shadow-2xl"
      />
      {segunda && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={segunda.imagen}
          alt={segunda.titulo}
          className="absolute bottom-2 right-[290px] h-44 w-44 -rotate-6 rounded-xl border-4 border-gold/60 object-cover shadow-xl"
        />
      )}
      {tercera && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tercera.imagen}
          alt={tercera.titulo}
          className="absolute right-[310px] top-4 h-36 w-36 rotate-6 rounded-xl border-4 border-white/15 object-cover shadow-xl"
        />
      )}
      <span className="diamond absolute bottom-10 right-2" aria-hidden />
      <span className="diamond absolute right-6 top-16" aria-hidden />
    </div>
  );
}
