# Script de Configuración de Base de Datos Cloud - Inmemso Architecture
# PowerShell para Windows

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN DE BASE DE DATOS CLOUD" -ForegroundColor Cyan
Write-Host "  Inmemso Architecture" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Instrucciones para obtener la URL
Write-Host "📋 PASO 1: Obtén tu URL de conexión cloud" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Neon.tech (RECOMENDADO):" -ForegroundColor Green
Write-Host "    1. Ve a https://console.neon.tech" -ForegroundColor White
Write-Host "    2. Crea un nuevo proyecto (Free Tier)" -ForegroundColor White
Write-Host "    3. Crea una base de datos llamada 'inmemso'" -ForegroundColor White
Write-Host "    4. Crea un usuario con password seguro" -ForegroundColor White
Write-Host "    5. Copia la URL de conexión (formato: postgresql://user:pass@host/db)" -ForegroundColor White
Write-Host ""
Write-Host "  Supabase (ALTERNATIVA):" -ForegroundColor Green
Write-Host "    1. Ve a https://supabase.com" -ForegroundColor White
Write-Host "    2. Crea un nuevo proyecto" -ForegroundColor White
Write-Host "    3. Ve a Settings > Database" -ForegroundColor White
Write-Host "    4. Copia la URL bajo 'URI'" -ForegroundColor White
Write-Host ""

# Paso 2: Actualizar .env.local
Write-Host "📋 PASO 2: Actualiza tu archivo .env.local" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Abre el archivo .env.local y reemplaza con:" -ForegroundColor White
Write-Host ""
Write-Host "  DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require" -ForegroundColor Cyan
Write-Host "  DATABASE_URI=postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require" -ForegroundColor Cyan
Write-Host "  PRISMA_DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require" -ForegroundColor Cyan
Write-Host ""

# Paso 3: Comandos a ejecutar
Write-Host "📋 PASO 3: Ejecuta estos comandos en la terminal" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd C:\Users\Administrador\Documents\FM\Inmemso\Web\inmemso-architecture" -ForegroundColor White
Write-Host "  npx prisma db push" -ForegroundColor White
Write-Host "  npx ts-node prisma/migrate-data.ts" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

# Paso 4: Verificación
Write-Host "📋 PASO 4: Verifica la conexión" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Si todo está correcto, verás:" -ForegroundColor White
Write-Host "    ✅ Database pushed successfully" -ForegroundColor Green
Write-Host "    ✅ Datos migrados desde MongoDB" -ForegroundColor Green
Write-Host "    ✅ Server running on http://localhost:5173" -ForegroundColor Green
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ¡CONFIGURACIÓN LISTA PARA INMEMSO!" -ForegroundColor Cyan
Write-Host "  El equipo puede acceder desde cualquier lugar" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

