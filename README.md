# Diamonds School — Página + Panel Administrativo

Plataforma simple para un colegio: página institucional pública con formulario de
inscripción, y un panel administrativo (`/admin`) para gestionar las solicitudes
enviadas, la galería de fotos y las publicaciones (noticias/avisos).

## Stack

- **Next.js 14** (App Router) — frontend y backend (API routes) en un solo proyecto
- **TypeScript + TailwindCSS**
- **Prisma + PostgreSQL** (compatible con Neon, Railway, etc.)
- Autenticación simple del admin por contraseña (cookie httpOnly firmada con HMAC)

## Funcionalidades

### Página pública (`/`)
- Hero, sobre nosotros, niveles educativos
- Galería con vista ampliada (lightbox) — contenido cargado desde la base de datos
- Noticias/avisos — contenido cargado desde la base de datos
- Formulario de inscripción con validación frontend + backend, anti-duplicados,
  y código único de solicitud (ej. `INS-2026-X7K2P`)
- Contacto (teléfono, WhatsApp, correo, dirección)

### Panel administrativo (`/admin`)
- Login con contraseña (definida en `.env`)
- **Solicitudes**: estadísticas por estado, tabla con búsqueda y filtro,
  detalle completo de cada solicitud, cambio de estado
  (Pendiente / En revisión / Aprobada / Rechazada), observaciones y eliminación
- **Galería**: subir imágenes con título y descripción, eliminar
- **Publicaciones**: crear y eliminar noticias/avisos

## Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tu DATABASE_URL (Neon), ADMIN_PASSWORD y AUTH_SECRET

# 3. Crear las tablas en la base de datos
npm run db:push

# 4. Levantar en desarrollo
npm run dev
```

Abre `http://localhost:3000` (página pública) y `http://localhost:3000/admin` (panel).

## Despliegue en Vercel

1. Sube el proyecto a GitHub y conéctalo a Vercel.
2. En **Settings → Environment Variables**, agrega todas las variables de `.env.example`.
3. El comando de build ya ejecuta `prisma generate` automáticamente.
4. Ejecuta `npx prisma db push` una vez desde tu máquina (apuntando al `DATABASE_URL`
   de producción) para crear las tablas en Neon.

## Cambiar el nombre del colegio

Todo el branding sale de variables de entorno (`NEXT_PUBLIC_SCHOOL_NAME`,
`NEXT_PUBLIC_SCHOOL_SLOGAN`, teléfono, WhatsApp, correo, dirección). No hay que
tocar código.

## Notas técnicas

- Las imágenes se guardan como base64 directamente en PostgreSQL para mantener el
  proyecto simple (sin S3/Supabase). Límite de 2MB por imagen. Si la galería crece
  mucho, el siguiente paso natural es migrar a Vercel Blob o Supabase Storage —
  solo habría que cambiar `POST /api/galeria` y guardar la URL en vez del base64.
- La sesión del admin dura 8 horas y se firma con `AUTH_SECRET`.
- Los niveles educativos se editan en `src/lib/config.ts`.
