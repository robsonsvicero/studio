import * as admin from 'firebase-admin';

let app;

if (!admin.apps.length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    
    // Limpeza Atômica: Remove aspas e extrai apenas o Base64 válido
    privateKey = privateKey.replace(/^["']|["']$/g, '').trim();
    
    const match = privateKey.match(/-----BEGIN PRIVATE KEY-----([\s\S]*)-----END PRIVATE KEY-----/);
    if (match) {
      // Remove ABSOLUTAMENTE TUDO que não seja caractere Base64 válido
      const content = match[1].replace(/[^a-zA-Z0-9+/=]/g, '');
      // Quebra em 64 caracteres por linha (padrão PEM rigoroso)
      const wrappedContent = (content.match(/.{1,64}/g) || []).join('\n');
      privateKey = `-----BEGIN PRIVATE KEY-----\n${wrappedContent}\n-----END PRIVATE KEY-----\n`;
    } else {
      // Fallback para chaves que vêm apenas com \n
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.error('Firebase Admin Error: Missing credentials. Check .env.local');
    }

    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
  app = admin.app();
}

export const adminDb = app ? admin.firestore() : null as any;
export const adminAuth = app ? admin.auth() : null as any;
export const adminStorage = app ? admin.storage() : null as any;
