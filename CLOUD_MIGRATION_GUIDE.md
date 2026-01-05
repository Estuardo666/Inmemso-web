# 🚀 GUÍA DE MIGRACIÓN A BASE DE DATOS CLOUD - INMEMSO ARCHITECTURE

## OBJETIVO
Migrar la base de datos PostgreSQL local a la nube (Neon.tech o Supabase) para:
- ✅ Acceso remoto del equipo (Mateo y Eddy)
- ✅ Despliegue inmediato en Vercel
- ✅ Eliminar problemas de PostgreSQL local colgado
- ✅ Alta disponibilidad y escalabilidad

---

## ⚡ MIGRACIÓN RÁPIDA (3 PASOS)

### PASO 1: Configurar Base de Datos Cloud

**Opción A: Neon.tech (RECOMENDADO)**
1. Ve a https://console.neon.tech
2. Crea cuenta gratuita
3. Crea nuevo proyecto: `inmemso-architecture`
4. En "Connection String", copia la URL completa
5. **Importante**: Cambia el nombre de la base de datos a `inmemso`

**Opción B: Supabase**
1. Ve a https://supabase.com
2. Crea proyecto gratuito
3. Ve a Settings > Database
4. Copia la URL bajo "URI"

**URL de ejemplo:**
```
postgresql://inmemso_user:SecurePass123@ep-silent-voice-123456.us-east-2.aws.neon.tech/inmemso?sslmode=require
```

---

### PASO 2: Actualizar Variables de Entorno

Abre `.env.local` y actualiza:

```env
# Base de datos cloud
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require&connect_timeout=10"
DATABASE_URI="postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require&connect_timeout=10"
PRISMA_DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require&connect_timeout=10"

# Configuración adicional
PAYLOAD_SECRET="your-secret-key-here"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:5173"
NODE_ENV="development"
PORT="5173"
```

**⚠️ IMPORTANTE**: 
- Reemplaza `TU_USUARIO`, `TU_PASSWORD` y `ep-proyecto` con tus credenciales reales
- Mantén `sslmode=require` para conexiones seguras
- El timeout evita bloqueos

---

### PASO 3: Sincronizar Esquema y Datos

```bash
# Navega al directorio
cd C:\Users\Administrador\Documents\FM\Inmemso\Web\inmemso-architecture

# 1. Sincroniza el esquema Prisma con la base de datos cloud
npx prisma db push

# 2. Migra los datos desde MongoDB (si aún tienes datos locales)
npx ts-node prisma/migrate-data.ts

# 3. Inicia el servidor de desarrollo
npm run dev
```

---

## 📊 VERIFICACIÓN POST-MIGRACIÓN

### Comandos de Verificación

```bash
# Verifica la conexión a PostgreSQL cloud
npx prisma studio

# Consulta el estado de la base de datos
npx prisma db status

# Genera el cliente Prisma
npx prisma generate
```

### Indicadores de Éxito

✅ **Éxito:**
- `npx prisma db push` muestra: "Database pushed successfully"
- `npm run dev` inicia sin errores de conexión
- El servidor corre en `http://localhost:5173`
- Puedes acceder al CMS desde cualquier máquina

❌ **Errores comunes:**
- `Error: connect ETIMEDOUT` → Verifica la URL y credenciales
- `Error: authentication failed` → Revisa usuario/password
- `Error: database "inmemso" does not exist` → Créala en el dashboard

---

## 🎯 CONFIGURACIÓN PARA VERCEL

Una vez local funcione, agrega estas variables en el dashboard de Vercel:

```
DATABASE_URL = postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require
DATABASE_URI = postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require
PRISMA_DATABASE_URL = postgresql://TU_USUARIO:TU_PASSWORD@ep-proyecto.neon.tech/inmemso?sslmode=require
PAYLOAD_SECRET = tu-secret-aqui
```

**Nota**: Para producción, crea una base de datos separada en Neon.tech (ej: `inmemso_prod`).

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### PostgreSQL Local Colgado
```powershell
# Detén servicios locales (si es necesario)
net stop postgresql-x64-14
# O usa el comando de Windows para detener el servicio
```

### Limpiar Historial de Terminal
```powershell
# En PowerShell, ejecuta:
Clear-History
# O simplemente cierra y abre una nueva terminal
```

### Resetear la Base de Datos Cloud
```bash
# Si necesitas empezar de cero:
npx prisma db push --force-reset
npx ts-node prisma/migrate-data.ts
```

---

## 📋 RESUMEN DE COMANDOS ÚTILES

```bash
# Ver esquema actual
npx prisma studio

# Generar migración (si cambias el schema.prisma)
npx prisma migrate dev --name "nombre-migracion"

# Ver datos en la nube
npx prisma db shell

# Limpiar y reinstalar
npx prisma generate
```

---

## 🎓 MEJORES PRÁCTICAS

1. **Nunca** commitees `.env.local` con credenciales reales
2. Usa `.env.example` como plantilla para el equipo
3. Mantén dos bases de datos: `inmemso_dev` y `inmemso_prod`
4. Configura backups automáticos en Neon.tech (incluido en free tier)
5. Monitorea el uso en el dashboard de Neon/Supabase

---

## 📞 SOPORTE INMEMSO

Para Mateo y Eddy:
- Comparte esta guía
- Proporciona las credenciales por canal seguro
- Ambos pueden usar la misma base de datos cloud
- El despliegue en Vercel será instantáneo

---

**Estado de la Migración**: 🔄 **PENDIENTE**  
**Próximo Paso**: Configurar `.env.local` con credenciales cloud

---
*Documentación generada para Inmemso Architecture - Enero 2026*

