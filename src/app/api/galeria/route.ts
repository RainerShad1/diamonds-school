import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const imagenes = await prisma.imagenGaleria.findMany({ orderBy: { creadaEn: 'desc' } });
  return NextResponse.json(imagenes);
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { titulo, descripcion, imagen } = await req.json().catch(() => ({}));

  if (!titulo?.trim() || !imagen) {
    return NextResponse.json({ error: 'Título e imagen son requeridos' }, { status: 400 });
  }
  if (!imagen.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Formato de imagen inválido' }, { status: 400 });
  }
  if (imagen.length > 3_000_000) {
    return NextResponse.json({ error: 'La imagen supera el límite de ~2MB' }, { status: 413 });
  }

  const item = await prisma.imagenGaleria.create({
    data: { titulo: titulo.trim(), descripcion: descripcion?.trim() || null, imagen },
  });
  return NextResponse.json(item);
}
