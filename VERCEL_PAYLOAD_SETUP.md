# Configuración de Payload CMS en Vercel

## 🚨 Problema Resuelto: Payload Colgando en Build

**Causa:** Payload CMS estaba pidiendo confirmación interactiva sobre cambios en la base de datos durante el build en Vercel, lo que causa que el proceso se cuelgue (timeout).

**Solución Implementada:** 
- `push: false` en producción (payload.config.ts)
- Uso de migraciones precompiladas (`prodMigrations`)
- Desabilitar prompts interactivos en Vercel

---

## ✅ Configuración Aplicada

### 1. **payload.config.ts**

```typescript
db: postgresAdapter({
  idType: 'uuid',
  // En desarrollo: push=true
  // En producción (Vercel): push=false para evitar prompts
  push: process.env.NODE_ENV !== 'production',
  // Usar migraciones precompiladas sin pedir confirmación
  prodMigrations: migrations,
  // Timeout más agresivo en Vercel
  connectTimeout: isVercel ? 20 : 10,
  // ... pool config
})
```

**Clave:** `push: process.env.NODE_ENV !== 'production'` asegura que:
- En desarrollo: Las migraciones se aplican automáticamente
- En producción (Vercel): No hay prompts interactivos

### 2. **vercel.json**

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "PAYLOAD_RUN_MIGRATIONS": "false"
  },
  "envPrefix": "NEXT_PUBLIC_"
}
```

### 3. **package.json - Build Script**

```json
"build": "prisma generate && next build && echo 'Build completed successfully'"
```

**Flujo de build en Vercel:**
1. `prisma generate` - Genera cliente Prisma (no interactivo)
2. `next build` - Compila la aplicación (incluye Payload setup sin prompts)
3. Echo para confirmar finalización

### 4. **Variables de Entorno en Vercel** 

Configurar en Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://[user]:[password]@[host]-pooler.neon.tech/[database]?sslmode=require
PAYLOAD_SECRET=[strong-random-key]
NODE_ENV=production
PAYLOAD_RUN_MIGRATIONS=false
```

⚠️ **IMPORTANTE:** Usar endpoint `-pooler` de Neon para Vercel (conexiones transientes)

---

## 🔧 Workflow de Migraciones

### Desarrollo Local
1. Cambios en schema de Payload → automáticos con `push: true`
2. Se genera archivo de migración en `prisma/migrations/`
3. Commit y push a GitHub

### Vercel Production
1. Build ejecuta `prisma generate` (sin interacción)
2. Payload aplica `prodMigrations` precompiladas (sin prompts)
3. No hay timeout

### Migraciones Manuales (si es necesario)
Si necesitas ejecutar migraciones en prod manualmente:

```bash
# Local - Generar migración
npx prisma migrate dev --name [migration-name]

# Vercel - Deploy después de migración
git push origin main
```

---

## 📋 Checklist Pre-Deploy

- [ ] `DATABASE_URL` configurada en Vercel (con `-pooler` de Neon)
- [ ] `PAYLOAD_SECRET` configurada en Vercel (fuerte y única)
- [ ] `NODE_ENV=production` configurada en Vercel
- [ ] `payload.config.ts` tiene `push: process.env.NODE_ENV !== 'production'`
- [ ] `prodMigrations: migrations` en la config de DB
- [ ] `vercel.json` tiene `PAYLOAD_RUN_MIGRATIONS: false`
- [ ] Las migraciones están en `prisma/migrations/` (committeadas)

---

## 🐛 Troubleshooting

### Error: "Build timeout after 60 minutes"
**Causa:** Payload está esperando input interactivo
**Solución:** Verificar `push: false` en producción y `PAYLOAD_RUN_MIGRATIONS=false`

### Error: "DATABASE_URL not found"
**Causa:** Variable de entorno no configurada en Vercel
**Solución:** Agregar en Vercel Dashboard

### Error: "Missing migration XYZ"
**Causa:** Nueva migración creada localmente pero no pusheada a GitHub
**Solución:** `npx prisma migrate dev` localmente, commit, push

---

## 🚀 Deploy Correcto

```bash
# 1. Desarrollo: cambios en Payload
# (Las migraciones se crean automáticamente)

# 2. Commit y push
git add .
git commit -m "feat: update payload schema"
git push origin main

# 3. Vercel detecta cambios
# - Build ejecuta: prisma generate && next build
# - Payload carga migraciones sin prompts
# - Deploy exitoso (sin timeout)
```

---

## 📚 Referencias

- [Payload CMS v3 Database Adapters](https://payloadcms.com/docs/database/overview)
- [Prisma Deployment Best Practices](https://www.prisma.io/docs/guides/deployment/edge)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Neon Connection Pooling](https://neon.tech/docs/connect/connection-pooling)

---

**Última actualización:** Enero 6, 2026  
**Verificado con:** Payload CMS v3 + Next.js 15.5.9 + Vercel
