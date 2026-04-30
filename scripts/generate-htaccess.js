const fs = require('fs');
const path = require('path');

const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Se o arquivo existir com .html, serve ele
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Fallback para index.html em caso de rotas dinâmicas no cliente
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

const outDir = path.join(process.cwd(), 'out');
const htaccessPath = path.join(outDir, '.htaccess');

if (fs.existsSync(outDir)) {
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log('✅ Arquivo .htaccess gerado com sucesso na pasta /out!');
} else {
  console.error('❌ Erro: Pasta /out não encontrada. Rode o build primeiro.');
}
