# 🎯 Instrucciones Finales - Migración a PostgreSQL

## ✅ Lo que ya está listo:

1. ✅ **Dependencias instaladas**: Prisma, Prisma Client, MongoDB, dotenv, ts-node
2. ✅ **Esquema Prisma creado**: `prisma/schema.prisma` (7 modelos)
3. ✅ **Script de migración**: `prisma/migrate-data.ts`
4. ✅ **Cliente Prisma generado**: Listo para usar
5. ✅ **Archivo de configuración**: `env.local` (copia a `.env`)

---

## ⚠️ ANTES DE EJECUTAR LA MIGRACIÓN:

### **1. Configura PostgreSQL**

Si no tienes PostgreSQL instalado:
```bash
# Opción 1: Instalar localmente
# Descarga desde: https://www.postgresql.org/download/windows/

# Opción 2: Usar Docker (recomendado)
docker run --name postgres-inmemso -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### **2. Crea la base de datos**

Conéctate a PostgreSQL y ejecuta:
```sql
CREATE DATABASE inmemso;
```

O usa el comando de PowerShell:
```powershell
psql -U postgres -c "CREATE DATABASE inmemso;"
```

### **3. Configura el archivo .env**

Copia el archivo `env.local` a `.env`:
```powershell
Copy-Item env.local .env
```

**Verifica que la URL sea correcta:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inmemso?schema=public"
MONGODB_URI="mongodb://localhost:27017/inmemso"
```

**Si usas contraseña diferente:**
```env
DATABASE_URL="postgresql://TU_USUARIO:TU_CONTRASEÑA@localhost:5432/inmemso?schema=public"
```

---

## 🚀 EJECUTAR LA MIGRACIÓN:

### **Paso 1: Verifica MongoDB**
Asegúrate de que MongoDB esté corriendo:
```powershell
# Verifica si MongoDB está activo
Get-Service -Name MongoDB

# Si no está corriendo, inícialo
Start-Service MongoDB
```

### **Paso 2: Crea las tablas en PostgreSQL**
```powershell
cd "c:\Users\Administrador\Documents\FM\Inmemso\Web\inmemso-architecture"
npx prisma db push
```

### **Paso 3: Ejecuta la migración**
```powershell
npx ts-node prisma\migrate-data.ts
```

---

## 📊 VERIFICAR LA MIGRACIÓN:

### **Opción 1: Usar Prisma Studio (UI visual)**
```powershell
npx prisma studio
```
Se abrirá una página web donde puedes ver todos los datos.

### **Opción 2: Consultas SQL directas**
```sql
-- Verificar usuarios
SELECT * FROM users;

-- Verificar proyectos
SELECT * FROM projects;

-- Verificar relaciones con servicios
SELECT p.title, ps.service 
FROM projects p 
JOIN project_services ps ON p.id = ps.projectId;

-- Verificar relaciones con tecnologías
SELECT p.title, pt.technology 
FROM projects p 
JOIN project_technologies pt ON p.id = pt.projectId;
```

---

## 🔧 SI HAY PROBLEMAS:

### **Error: "Database not found" o "connection refused"**
- ✅ PostgreSQL está corriendo?
- ✅ Creaste la base de datos `inmemso`?
- ✅ La URL en `.env` es correcta?

### **Error: "MongoDB not connected"**
- ✅ MongoDB está corriendo?
- ✅ La URI en `.env` es correcta?
- ✅ Tienes datos en la colección?

### **Error: "PrismaClientInitializationError"**
Ejecuta primero:
```powershell
npx prisma generate
npx prisma db push
```

---

## 📝 RESUMEN DE ARCHIVOS:

```
inmemso-architecture/
├── .env                          ← Configura esto primero
├── env.local                     ← Plantilla (copia a .env)
├── prisma/
│   ├── schema.prisma            ← Esquema de PostgreSQL
│   ├── migrate-data.ts          ← Script de migración
│   ├── INSTRUCCIONES_MIGRACION.md ← Detalles técnicos
│   └── MIGRACION_COMPLETE.md    ← Resumen completo
└── MIGRACION_POSTGRESQL.md      ← Resumen en raíz
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE LA MIGRACIÓN:

1. ✅ Verifica los datos con `npx prisma studio`
2. ✅ Actualiza tu aplicación para usar Prisma Client
3. ✅ Prueba todas las funcionalidades
4. ✅ Haz backup de MongoDB antes de eliminarla

---

**¿Listo para ejecutar? Empieza con el Paso 1: Configura PostgreSQL** 🚀








