# 🚨 SOLUCIÓN URGENTE: Tablas eliminándose en Producción

## Problema Crítico Detectado

La variable de entorno `PAYLOAD_DROP_DATABASE=true` está configurada en Vercel, causando que **TODAS las tablas se eliminen** cada vez que alguien accede a `/admin` en producción.

## Solución Inmediata (Ejecutar AHORA)

### Paso 1: Eliminar la Variable en Vercel

1. Ve a https://vercel.com/stuarts-projects-bdd60b3d/inmemso-web/settings/environment-variables
2. Busca la variable `PAYLOAD_DROP_DATABASE`
3. **ELIMÍNALA** completamente (no la cambies a `false`, elimínala)
4. Haz clic en "Save"

### Paso 2: Redeploy

Después de eliminar la variable:
```bash
git commit --allow-empty -m "trigger redeploy after removing PAYLOAD_DROP_DATABASE"
git push
```

O desde Vercel Dashboard:
1. Ve a la pestaña "Deployments"
2. Haz clic en los tres puntos del último deployment
3. Selecciona "Redeploy"

## Verificación

Después del redeploy, revisa los logs en Vercel. **NO deberías ver**:
- `---- DROPPING TABLES SCHEMA(public) ----`
- `---- DROPPED TABLES ----`

## Configuración Correcta para Producción

Las variables que **SÍ** deben estar en Vercel:
```env
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=xIlHCfoPZXNzbE28Ur1hRv6weW7QLAqBK5gdJFunOpYst04jSyiG39DkVmaMTc
PAYLOAD_PUBLIC_SERVER_URL=https://inmemso-web.vercel.app
CLOUDINARY_CLOUD_NAME=stuart9713
CLOUDINARY_API_KEY=877951125282976
CLOUDINARY_API_SECRET=l2hdQbzyhitg5kw8npjxPe413Xs
NODE_ENV=production
```

Variables que **NUNCA** deben estar en producción:
```env
PAYLOAD_DROP_DATABASE=true  ❌ NUNCA EN PRODUCCIÓN
ALLOW_DESTRUCTIVE=1          ❌ NUNCA EN PRODUCCIÓN
```

## Estado Actual del Código

El código ya está configurado correctamente:
- ✅ `push: false` (no hace auto-schema push en producción)
- ✅ `prodMigrations: migrations` (usa migraciones explícitas)
- ✅ Protecciones en `full-reset-db.ts` contra ejecución en producción

El problema es **SOLO** la variable de entorno en Vercel.

## Para Desarrollo Local

Si necesitas resetear la BD localmente, usa:
```bash
$env:ALLOW_DESTRUCTIVE="1"
npm run db:reset-full
npx prisma db push
npx tsx src/scripts/fix-defaults.ts
```

**NUNCA uses `PAYLOAD_DROP_DATABASE=true` en ningún entorno.**
