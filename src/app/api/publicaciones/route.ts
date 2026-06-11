import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await prisma.publicacion.findMany({ orderBy: { creadaEn: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { titulo, contenido } = await req.json().catch(() => ({}));
  if (!titulo?.trim() || !contenido?.trim()) {
    return NextResponse.json({ error: 'Título y contenido son requeridos' }, { status: 400 });
  }
  const post = await prisma.publicacion.create({
    data: { titulo: titulo.trim(), contenido: contenido.trim() },
  });
  return NextResponse.json(post);
}
