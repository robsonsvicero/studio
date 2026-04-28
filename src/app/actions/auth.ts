'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating session cookie', error);
    return { success: false, error: 'Unauthorized request' };
  }
}

export async function removeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true };
}
