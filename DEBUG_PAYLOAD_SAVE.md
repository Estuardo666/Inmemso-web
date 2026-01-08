# Guía de Debugging: Los datos no se guardan en Payload

## PROBLEMA IDENTIFICADO

El servidor está devolviendo:
```
[getHome] Raw Payload doc: undefined
[getHome] No doc found, returning FALLBACK_HOME
```

Pero en Payload Admin ves que guardaste los datos.

## CAUSAS POSIBLES

### 1. La DB NO está guardando los datos
- Los POST 200 son "OK" pero sin persistencia real
- Solución: Verificar que DATABASE_URL está correcta

### 2. El endpoint /api/globals/home NO devuelve datos
- Payload Admin ≠ Payload API
- Solución: Llamar directamente a la API

### 3. Problema de Scope/Visibility
- Los datos se guardan pero no son accesibles
- Solución: Revisar permisos de acceso

## COMO DEBUGUEAR

### Paso 1: Verificar API directa
```bash
# Terminal 1: Tener el servidor corriendo
npm run dev

# Terminal 2: Probar la API
npm run test:payload
```

Este comando te mostrará exactamente qué está devolviendo Payload.

### Paso 2: Verificar Base de Datos
```bash
# Si tienes psql instalado:
psql $env:DATABASE_URL -f test-db-globals.sql

# O desde Neon Console web:
# 1. Ve a https://console.neon.tech
# 2. Selecciona tu proyecto
# 3. Ve a SQL Editor
# 4. Ejecuta el query en test-db-globals.sql
```

### Paso 3: Verificar que Payload Admin esté guardando realmente
```
Mira en Payload Admin (/admin/globals/home):
- Guarda UN cambio pequeño
- Mira en la consola del servidor si hay error
- Si ves POST 200, debería guardarse
```

## SOLUCION: Reset Completo de Payload

Si todo lo anterior falla:

```bash
# 1. Detener servidor (Ctrl + C)

# 2. Regenerar todo
npx prisma generate
npx prisma db push

# 3. Limpiar cache
npm run clean-cache

# 4. Restart
npm run dev

# 5. Vuelve a llenar los datos en /admin/globals/home
```

## VERIFICACION RAPIDA

Abre Developer Tools en Payload Admin (F12):

1. Network tab
2. Haz click en Save
3. Busca el request POST a /admin/globals/home
4. Verifica que diga "200"
5. Revisa el Response para ver si hay errores

## SI SIGUE SIN FUNCIONAR

Proporciona:
1. Output de `npm run test:payload`
2. Output de `npm run dev` (los logs)
3. Screenshot de Payload Admin mostrando los datos llenos
4. Resultado de `psql $env:DATABASE_URL -c "SELECT key FROM payload_globals;"`
