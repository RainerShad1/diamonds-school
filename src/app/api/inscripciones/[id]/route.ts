import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.estado) data.estado = body.estado;
  if (body.observaciones !== undefined) data.observaciones = body.observaciones;
  const solicitud = await prisma.solicitud.update({ where: { id: params.id }, data });
  return NextResponse.json(solicitud);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await prisma.solicitud.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
