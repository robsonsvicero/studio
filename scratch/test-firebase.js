const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Carrega o .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('--- Teste de Inicialização Firebase ---');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Chave existe:', !!process.env.FIREBASE_PRIVATE_KEY);

try {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  
  // 1. Remove aspas e limpa espaços nas extremidades
  privateKey = privateKey.replace(/^["']|["']$/g, '').trim();
  
  // 2. Extrai apenas o conteúdo entre BEGIN e END, se eles existirem
  const match = privateKey.match(/-----BEGIN PRIVATE KEY-----([\s\S]*)-----END PRIVATE KEY-----/);
  if (match) {
    // Pega o conteúdo do meio e remove ABSOLUTAMENTE TUDO que não seja caractere Base64 válido
    const content = match[1].replace(/[^a-zA-Z0-9+/=]/g, '');
    console.log('Tamanho do conteúdo Base64 (limpeza atômica):', content.length);
    
    // Quebra o conteúdo em linhas de 64 caracteres (padrão PEM)
    const wrappedContent = (content.match(/.{1,64}/g) || []).join('\n');
    
    // Reconstrói a chave no formato PEM rigoroso
    privateKey = `-----BEGIN PRIVATE KEY-----\n${wrappedContent}\n-----END PRIVATE KEY-----\n`;
  } else {
    // Se não tiver os marcadores, tenta tratar como uma string \n
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  console.log('Chave reconstruída começa com:', privateKey.substring(0, 40));
  console.log('Chave reconstruída termina com:', privateKey.substring(privateKey.length - 40));

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });

  console.log('✅ Sucesso! O Firebase inicializou corretamente com essas configurações.');
} catch (error) {
  console.error('❌ Erro na inicialização:');
  console.error(error.message);
  if (error.stack) {
    console.error('Stack:', error.stack.split('\n')[0]);
  }
}
