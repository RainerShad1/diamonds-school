import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'ds_admin';

function sign(value: string) {
  const secret = process.env.AUTH_SECRET || 'dev-secret';
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function sessionToken() {
  return sign('admin-session');
}

export function isAdmin(): boolean {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  const expected = sessionToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function adminCookie() {
  return {
    name: COOKIE,
    value: sessionToken(),
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  };
}

export const COOKIE_NAME = COOKIE;
