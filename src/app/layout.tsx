import type { Metadata } from 'next';
import { Marcellus, Inter } from 'next/font/google';
import { school } from '@/lib/config';
import './globals.css';

const display = Marcellus({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: `${school.name} — ${school.slogan}`,
  description: `Página oficial de ${school.name}. Inscripciones, noticias, galería y contacto.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
