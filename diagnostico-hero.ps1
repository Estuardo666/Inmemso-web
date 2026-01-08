# Script de Diagnostico: Hero CMS Connection
# Verifica la conexion entre Payload CMS y el componente Hero

Write-Host "DIAGNOSTICO AUTOMATICO: Hero CMS Connection" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

# 1. Verificar variables de entorno
Write-Host "1. Verificando Variables de Entorno..." -ForegroundColor Yellow
Write-Host ""

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    $envFile = ".env"
}

if (Test-Path $envFile) {
    Write-Host "[OK] Archivo de entorno encontrado: $envFile" -ForegroundColor Green
    
    $envContent = Get-Content $envFile -Raw
    
    if ($envContent -match "DATABASE_URL=") {
        Write-Host "[OK] DATABASE_URL configurada" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] DATABASE_URL NO configurada" -ForegroundColor Red
    }
    
    if ($envContent -match "PAYLOAD_SECRET=") {
        Write-Host "[OK] PAYLOAD_SECRET configurada" -ForegroundColor Green
    } else {
        Write-Host "[WARN] PAYLOAD_SECRET no configurada (usara dev-payload-secret)" -ForegroundColor Yellow
    }
} else {
    Write-Host "[ERROR] No se encontro archivo .env o .env.local" -ForegroundColor Red
}

Write-Host ""

# 2. Verificar que el servidor este corriendo
Write-Host "2. Verificando Servidor Local..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/globals/home" -Method GET -ErrorAction Stop -TimeoutSec 5
    Write-Host "[OK] Servidor respondiendo correctamente" -ForegroundColor Green
    
    # Parsear JSON
    $homeData = $response.Content | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "Datos del Hero en Payload:" -ForegroundColor Cyan
    Write-Host "  Pretitulo: $($homeData.hero.pretitulo)" -ForegroundColor White
    Write-Host "  Titulo: $($homeData.hero.titulo)" -ForegroundColor White
    Write-Host "  Subtitulo: $($homeData.hero.subtitulo)" -ForegroundColor White
    
    if ($homeData.hero.pretitulo -eq "Ingenieria que trasciende" -and 
        $homeData.hero.titulo -eq "INMEMSO") {
        Write-Host ""
        Write-Host "[WARN] Los datos parecen ser los del FALLBACK" -ForegroundColor Yellow
        Write-Host "   Esto significa que NO has guardado datos personalizados en Payload Admin" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "SOLUCION:" -ForegroundColor Magenta
        Write-Host "   1. Ve a http://localhost:3000/admin/globals/home" -ForegroundColor White
        Write-Host "   2. Modifica los campos del Hero" -ForegroundColor White
        Write-Host "   3. Click en 'Save'" -ForegroundColor White
        Write-Host "   4. Ejecuta: npm run clean-cache" -ForegroundColor White
        Write-Host "   5. Ejecuta: npm run dev" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "[OK] Los datos parecen ser personalizados (no son fallback)" -ForegroundColor Green
    }
    
} catch {
    Write-Host "[ERROR] No se pudo conectar al servidor" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUCION:" -ForegroundColor Magenta
    Write-Host "   1. Asegurate de que el servidor este corriendo: npm run dev" -ForegroundColor White
    Write-Host "   2. Espera a que el servidor inicie completamente" -ForegroundColor White
    Write-Host "   3. Ejecuta este script nuevamente" -ForegroundColor White
}

Write-Host ""

# 3. Verificar cache de Next.js
Write-Host "3. Verificando Cache de Next.js..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".next") {
    $cacheSize = (Get-ChildItem -Path ".next" -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "[WARN] Cache de Next.js existe ($([math]::Round($cacheSize, 2)) MB)" -ForegroundColor Yellow
    Write-Host "   Si los cambios no se reflejan, ejecuta: npm run clean-cache" -ForegroundColor White
} else {
    Write-Host "[OK] No hay cache de Next.js" -ForegroundColor Green
}

Write-Host ""

# 4. Verificar archivos modificados
Write-Host "4. Verificando Archivos Modificados..." -ForegroundColor Yellow
Write-Host ""

$filesToCheck = @(
    "components\Hero.tsx",
    "src\lib\getPayloadContent.ts",
    "app\(frontend)\page.tsx",
    "App.tsx"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "[OK] $file existe" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $file NO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host ""

# 5. Resumen y Recomendaciones
Write-Host "============================================================" -ForegroundColor Gray
Write-Host "RESUMEN Y RECOMENDACIONES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

Write-Host "Para que los cambios del CMS se reflejen:" -ForegroundColor White
Write-Host ""
Write-Host "1. Edita los datos en Payload Admin:" -ForegroundColor Magenta
Write-Host "   http://localhost:3000/admin/globals/home" -ForegroundColor White
Write-Host ""
Write-Host "2. Guarda los cambios (boton Save)" -ForegroundColor Magenta
Write-Host ""
Write-Host "3. Limpia el cache:" -ForegroundColor Magenta
Write-Host "   npm run clean-cache" -ForegroundColor White
Write-Host ""
Write-Host "4. Reinicia el servidor:" -ForegroundColor Magenta
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "5. Refresca el navegador:" -ForegroundColor Magenta
Write-Host "   Ctrl + Shift + R (Windows)" -ForegroundColor White
Write-Host ""

Write-Host "============================================================" -ForegroundColor Gray
Write-Host "Diagnostico Completado" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Gray

