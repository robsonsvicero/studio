$ErrorActionPreference = 'Stop'

$apiPath = 'src/app/api'
$apiBackupPath = 'src/api_routes'
$middlewarePath = 'src/middleware.ts'
$middlewareBackupPath = 'src/middleware.static.ts'
$previousStaticExport = $env:NEXT_PUBLIC_STATIC_EXPORT
$apiMoved = $false
$middlewareMoved = $false

try {
    Remove-Item out -Recurse -Force -ErrorAction SilentlyContinue
    $env:NEXT_PUBLIC_STATIC_EXPORT = 'true'

    if (Test-Path $apiPath) {
        Move-Item $apiPath $apiBackupPath -Force
        $apiMoved = $true
    }

    if (Test-Path $middlewarePath) {
        Move-Item $middlewarePath $middlewareBackupPath -Force
        $middlewareMoved = $true
    }

    & npx next build
    if ($LASTEXITCODE -ne 0) {
        throw 'O build estático do Next.js falhou.'
    }

    if (Test-Path out) {
        & node scripts/generate-htaccess.js
        if ($LASTEXITCODE -ne 0) {
            throw 'A geração do arquivo .htaccess falhou.'
        }
    } else {
        throw 'Pasta out não foi criada pelo Next.js. Verifique os erros acima.'
    }
} finally {
    if ($middlewareMoved -and (Test-Path $middlewareBackupPath)) {
        Move-Item $middlewareBackupPath $middlewarePath -Force
    }

    if ($apiMoved -and (Test-Path $apiBackupPath)) {
        Move-Item $apiBackupPath $apiPath -Force
    }

    if ($null -eq $previousStaticExport) {
        Remove-Item Env:NEXT_PUBLIC_STATIC_EXPORT -ErrorAction SilentlyContinue
    } else {
        $env:NEXT_PUBLIC_STATIC_EXPORT = $previousStaticExport
    }
}