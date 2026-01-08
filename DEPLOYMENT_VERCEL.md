# 🚀 Desplegar a Vercel (Producción)

## 📋 Checklist Pre-Deployment

### 1. Variables de Entorno en Vercel

Ve a [Vercel Dashboard](https://vercel.com) → Tu proyecto `inmemso-web` → Settings → Environment Variables

**Variables CRÍTICAS que debes configurar:**

```bash
# Database (ya configuradas probablemente)
DATABASE_URL=postgresql://neondb_owner:npg_1GmAoOd7aRQI@ep-rough-star-a4ff7o72-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_1GmAoOd7aRQI@ep-rough-star-a4ff7o72-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Payload CMS
PAYLOAD_SECRET=xIlHCfoPZXNzbE28Ur1hRv6weW7QLAqBK5gdJFunOpYst04jSyiG39DkVmaMTc

# ⚠️ IMPORTANTE: URL de producción (NO localhost)
PAYLOAD_PUBLIC_SERVER_URL=https://inmemso-web.vercel.app
# O si tienes dominio custom:
# PAYLOAD_PUBLIC_SERVER_URL=https://tudominio.com

# Timeouts y Revalidación
PAYLOAD_FETCH_TIMEOUT_MS=15000
PAYLOAD_REVALIDATE_SECONDS=300

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=stuart9713
CLOUDINARY_API_KEY=877951125282976
CLOUDINARY_API_SECRET=l2hdQbzyhitg5kw8npjxPe413Xs

# Seguridad Payload (NO ejecutar migraciones automáticas en Vercel)
PAYLOAD_RUN_MIGRATIONS=false
PAYLOAD_PUSH=false
```

### 2. Verificar .gitignore

✅ Asegúrate de que `.env.local` NO se suba a Git:

```bash
# Ya está en .gitignore:
.env*.local
```

### 3. Commit y Push

```bash
# Agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Conectar Hero, Seccion2, Services, Soluciones, Trayectoria, Portafolio y Clientes a Payload CMS"

# Push a GitHub (Vercel auto-despliega)
git push origin main
```

---

## 🔄 Proceso de Deployment

### Automático (Recomendado)

1. **Push a GitHub** → Vercel detecta cambios automáticamente
2. **Build en Vercel** → Logs en tiempo real
3. **Deploy completo** → URL de producción actualizada

### Verificación Post-Deploy

Una vez que Vercel termine el build:

1. Ve a `https://inmemso-web.vercel.app` (o tu dominio)
2. Verifica que:
   - **Hero** muestra los datos del CMS (ej: "Inmemso Studio")
   - **Sección 2 (About)** muestra pretítulo, título, párrafo del CMS
   - **Services** muestra header del CMS
   - **Soluciones** muestra header del CMS
   - **Trayectoria** muestra items del CMS
   - **Portafolio** muestra header del CMS
   - **Clientes** muestra logos del CMS

3. **Acceder al Admin**:
   - `https://inmemso-web.vercel.app/admin`
   - Login con tu usuario
   - Editar contenido en Home → Hero, Seccion2, etc.
   - **Guardar** → Los cambios se reflejan en la base de datos de Neon (PostgreSQL)

---

## 🐛 Troubleshooting

### Problema: "Data muestra fallback en producción"

**Causa**: PAYLOAD_PUBLIC_SERVER_URL apunta a localhost o está mal

**Solución**:
```bash
# En Vercel Environment Variables:
PAYLOAD_PUBLIC_SERVER_URL=https://inmemso-web.vercel.app
```

### Problema: "Timeout errors en producción"

**Causa**: Vercel functions tienen límite de tiempo más estricto

**Solución**:
```bash
# Aumentar timeout en Vercel:
PAYLOAD_FETCH_TIMEOUT_MS=20000
```

### Problema: "Imágenes no se muestran"

**Causa**: Cloudinary mal configurado

**Solución**:
- Verifica las 3 variables CLOUDINARY_* en Vercel
- Asegúrate de que las imágenes se suban desde el Admin

### Problema: "Build falla en Vercel"

**Logs comunes**:
```bash
# Error: Missing PAYLOAD_SECRET
# Solución: Agregar PAYLOAD_SECRET en Vercel env vars

# Error: Database connection timeout
# Solución: Verificar DATABASE_URL (debe usar pooler de Neon)
```

---

## 📝 Notas Importantes

### Base de Datos

- **Desarrollo local**: Usa `.env.local` con `PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000`
- **Producción Vercel**: Usa variables de entorno con URL de producción

### Caché y Revalidación

- ISR configurado con `revalidate: 300` (5 minutos)
- Para ver cambios inmediatos en producción: Hard refresh (`Ctrl+Shift+R`)
- Payload Admin guarda en DB instantáneamente, pero frontend cachea

### Migraciones de Base de Datos

- **NUNCA** ejecutar migraciones automáticas en Vercel (`PAYLOAD_RUN_MIGRATIONS=false`)
- Ejecutar migraciones manualmente desde local si se cambia schema:
  ```bash
  npx payload migrate
  ```

---

## ✅ Checklist Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` apunta a producción (NO localhost)
- [ ] `.env.local` NO está en Git
- [ ] Commit y push realizados
- [ ] Build de Vercel completado sin errores
- [ ] Frontend muestra datos del CMS
- [ ] Admin `/admin` accesible y funcional
- [ ] Imágenes de Cloudinary funcionan
- [ ] Logos de clientes se muestran

---

## 🎯 Próximos Pasos (Opcional)

1. **Dominio Custom**: Configurar `tudominio.com` en Vercel
2. **Remover Debug Logs**: Quitar console.log antes de producción
3. **Performance**: Implementar lazy loading para imágenes
4. **SEO**: Verificar meta tags dinámicos desde Payload
5. **Analytics**: Integrar Google Analytics o similar

---

## 📞 Soporte

Si tienes problemas:
1. Revisa logs de Vercel: `vercel.com/[tu-proyecto]/deployments`
2. Verifica variables de entorno en Vercel Dashboard
3. Prueba en local primero: `npm run build && npm start`
