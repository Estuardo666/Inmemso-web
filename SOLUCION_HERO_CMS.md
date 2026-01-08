# 🎯 Solución: Conectar Hero del Frontend con Payload CMS

## 📋 Problema Identificado

Los datos del **Hero** (sección principal) están **hardcodeados** en el fallback y no se actualizan cuando modificas los campos en Payload Admin.

---

## ✅ Solución Implementada

### Cambios Realizados

1. **Hero.tsx**: Eliminé el fallback hardcodeado interno
2. **getPayloadContent.ts**: Agregué logging para debug
3. **package.json**: Agregué comando `clean-cache` para limpiar caché de Next.js

---

## 🚀 Pasos para Ver los Cambios del CMS

### Paso 1: Acceder a Payload Admin

```
http://localhost:3000/admin
```

**Login:** Usa tus credenciales de administrador

---

### Paso 2: Ir a la Configuración Global "Home"

1. En el menú lateral, busca **"Globals"**
2. Click en **"Home"**
3. Verás una sección llamada **"Hero"**

---

### Paso 3: Rellenar TODOS los Campos del Hero

**IMPORTANTE:** Debes rellenar TODOS los campos, no solo algunos:

```yaml
Hero:
  Imagen: [Subir o seleccionar una imagen de Media]
  Video: [Opcional - URL de video]
  Pretitulo: "Ingeniería que trasciende"
  Titulo: "INMEMSO"
  Subtitulo: "Arquitectura Integral & Ingeniería Industrializada"
  Parrafo: "Creamos estructuras que desafían lo convencional..."
  Texto_boton_1: "Ver Proyectos"
  Url_boton_1: "#portafolio"
  Texto_boton_2: "Contáctanos"
  Url_boton_2: "#contacto"
```

---

### Paso 4: Guardar los Cambios

1. Click en el botón **"Save"** (arriba a la derecha)
2. Espera la confirmación de guardado exitoso

---

### Paso 5: Limpiar Caché y Reiniciar

**En la terminal de PowerShell**, ejecuta:

```powershell
# 1. Detener el servidor (Ctrl + C)

# 2. Limpiar el caché de Next.js
npm run clean-cache

# 3. Reiniciar el servidor
npm run dev
```

---

### Paso 6: Verificar los Cambios

1. Abre el navegador en `http://localhost:3000`
2. **Refresca la página con caché limpio:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Revisa la consola del navegador** (F12 > Console):
   ```
   [Hero] Rendered with data: { pretitulo: "...", titulo: "..." }
   ```

4. **Revisa la consola del servidor**:
   ```
   [getHome] Raw Payload doc: { ... }
   ```

---

## 🔍 Debug: ¿Por Qué No Se Actualizan los Datos?

### Causa 1: Campos Vacíos en Payload

**Problema:** Si dejas campos vacíos en Payload, el sistema usa el fallback.

**Solución:** Rellena TODOS los campos del Hero en `/admin/globals/home`.

---

### Causa 2: Caché de Next.js

**Problema:** Next.js cachea las respuestas de API por 60 segundos (configurado en `getPayloadContent.ts`).

**Solución:**
```powershell
npm run clean-cache
```

---

### Causa 3: Revalidación ISR

**Problema:** El sistema está configurado con ISR (Incremental Static Regeneration) de 60 segundos.

**Solución Temporal:** Cambia el tiempo de revalidación para desarrollo.

Edita `.env` o `.env.local`:
```env
# Reduce el tiempo de caché para desarrollo
PAYLOAD_REVALIDATE_SECONDS=1
```

---

## 🛠️ Verificación Técnica

### 1. Verificar que Payload Tenga los Datos

**Opción A: Admin UI**
- Ve a `/admin/globals/home`
- Verifica que todos los campos tengan valores

**Opción B: API Directa**
```bash
# En PowerShell
curl http://localhost:3000/api/globals/home | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

### 2. Verificar Logs del Servidor

En la terminal donde corre `npm run dev`, deberías ver:

```
[getHome] Raw Payload doc: {
  "pretitulo": "Ingeniería que trasciende",
  "titulo": "INMEMSO",
  ...
}
```

**Si ves `[getHome] No doc found, returning FALLBACK_HOME`**, significa que Payload no tiene datos guardados.

---

### 3. Verificar Logs del Cliente

En la consola del navegador (F12 > Console):

```
[Hero] Rendered with data: {
  pretitulo: "Ingeniería que trasciende",
  titulo: "INMEMSO",
  ...
}
```

---

## 📊 Flujo de Datos (Para Entender el Sistema)

```
┌─────────────────┐
│  Payload Admin  │  ← Aquí editas los datos
│  /admin/globals │
└────────┬────────┘
         │
         ↓ (guardado en DB)
┌─────────────────┐
│   PostgreSQL    │  ← Base de datos Neon
│    (Neon)       │
└────────┬────────┘
         │
         ↓ (fetch desde servidor)
┌─────────────────┐
│ getPayloadContent.ts │ ← Obtiene datos del API
│  getHome()      │ ← Merge con fallback
└────────┬────────┘
         │
         ↓ (props)
┌─────────────────┐
│   page.tsx      │ ← Server Component
│  (frontend)     │
└────────┬────────┘
         │
         ↓ (props)
┌─────────────────┐
│     App.tsx     │ ← Client Component
└────────┬────────┘
         │
         ↓ (props)
┌─────────────────┐
│    Hero.tsx     │ ← Renderiza los datos
└─────────────────┘
```

---

## 🧪 Testing Rápido

**Para probar que todo funciona:**

1. **Edita el título en Payload Admin:**
   - Ve a `/admin/globals/home`
   - Cambia `titulo` de "INMEMSO" a "INMEMSO TEST"
   - Guarda

2. **Limpia caché:**
   ```powershell
   npm run clean-cache
   npm run dev
   ```

3. **Refresca el navegador:**
   - Deberías ver "INMEMSO TEST" en el Hero

4. **Si funciona:**
   - ✅ El sistema está conectado correctamente
   - Vuelve a poner "INMEMSO" y guarda

---

## 🚨 Si Aún No Funciona

### Verifica que Payload esté Conectado a la DB

```powershell
# En la raíz del proyecto
cat .env
```

Debe tener:
```env
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=dev-payload-secret
```

---

### Verifica que la Tabla "home" Exista

```powershell
# Accede a la DB desde Neon Console
# O usa este comando si tienes psql instalado:
psql $env:DATABASE_URL -c "SELECT id FROM payload_preferences WHERE key = 'home';"
```

---

### Última Solución: Reset Completo

```powershell
# 1. Detener el servidor
# 2. Limpiar todo
npm run clean-cache
Remove-Item -Recurse -Force node_modules/.cache

# 3. Re-generar Prisma
npx prisma generate

# 4. Reiniciar
npm run dev
```

---

## 🎓 Notas Finales

### Logging de Debug

Los logs agregados son **temporales**. Una vez que todo funcione, puedes eliminarlos:

**En `Hero.tsx`:**
```tsx
// Eliminar estas líneas:
if (typeof window !== 'undefined') {
  console.log('[Hero] Rendered with data:', heroData)
}
```

**En `getPayloadContent.ts`:**
```tsx
// Eliminar estas líneas:
console.log('[getHome] Raw Payload doc:', JSON.stringify(doc?.hero, null, 2))
console.log('[getHome] No doc found, returning FALLBACK_HOME')
```

---

## 📞 Contacto

Si después de seguir todos estos pasos aún no funciona, envíame:

1. Logs de la consola del servidor
2. Logs de la consola del navegador
3. Screenshot de `/admin/globals/home` con los datos llenos
4. Resultado de `curl http://localhost:3000/api/globals/home`

---

**¡Éxito! 🚀**
