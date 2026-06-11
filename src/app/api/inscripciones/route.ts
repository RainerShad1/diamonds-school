import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function generarCodigo() {
  const anio = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `INS-${anio}-${rand}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const { nombreEstudiante, fechaNacimiento, nivel, nombreTutor, telefono, email, mensaje } = body;

  // Validación backend
  if (!nombreEstudiante?.trim() || !fechaNacimiento || !nivel || !nombreTutor?.trim() || !telefono?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Completa todos los campos requeridos' }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Correo electrónico inválido' }, { status: 400 });
  }

  // Evitar duplicados: mismo estudiante + mismo correo con solicitud activa
  const existente = await prisma.solicitud.findFirst({
    where: {
      nombreEstudiante: { equals: nombreEstudiante.trim(), mode: 'insensitive' },
      email: { equals: email.trim(), mode: 'insensitive' },
      estado: { in: ['PENDIENTE', 'EN_REVISION'] },
    },
  });
  if (existente) {
    return NextResponse.json(
      { error: `Ya existe una solicitud activa para este estudiante (código ${existente.codigo})` },
      { status: 409 },
    );
  }

  const solicitud = await prisma.solicitud.create({
    data: {
      codigo: generarCodigo(),
      nombreEstudiante: nombreEstudiante.trim(),
      fechaNacimiento,
      nivel,
      nombreTutor: nombreTutor.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
      mensaje: mensaje?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true, codigo: solicitud.codigo });
}

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const solicitudes = await prisma.solicitud.findMany({ orderBy: { creadaEn: 'desc' } });
  return NextResponse.json(solicitudes);
}
