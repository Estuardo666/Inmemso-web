# Configuración de Estilos para Payload Admin

## ✅ Configuración Aplicada (Enero 2026)

### 1. **Importar CSS de Payload en el Layout**

**Archivo:** `app/(payload)/layout.tsx`

```tsx
import React from 'react'
import '@payloadcms/next/css'  // ← CRÍTICO: Carga los estilos base del admin
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@/payload.config'

import { importMap as generatedImportMap } from './admin/importMap.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function serverFunction(args: { name: string; args: Record<string, unknown> }) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap: generatedImportMap,
  })
}

export default function PayloadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootLayout
      config={config}
      importMap={generatedImportMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
```

---

### 2. **Configurar Componentes y CSS Personalizados en payload.config.ts**

**Archivo:** `payload.config.ts`

```typescript
export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      title: 'Inmemso Architecture CMS',
      ogImage: '/thumbnail.jpg',
    } as any,
    components: {
      graphics: {
        // Usar ALIAS @/ en lugar de rutas absolutas para evitar UnhandledSchemeError en Windows
        Logo: '@/components/admin/InmemsoLogo',
      },
    },
    // Normalizar ruta CSS con forward slashes para compatibilidad con Webpack en Windows
    css: path.posix.join(dirname.replace(/\\/g, '/'), 'components/admin/admin.css'),
    importMap: {
      baseDir: path.resolve(dirname, 'app/(payload)/admin'),
    },
  },
  // ... resto de la configuración
})
```

---

### 3. **Componente Logo Personalizado**

**Archivo:** `components/admin/InmemsoLogo.tsx`

```tsx
import React from 'react'

export const InmemsoLogo: React.FC = () => {
  return (
    <div className="inmemso-logo" aria-label="Inmemso admin logo">
      <span className="inmemso-logo__mark">IM</span>
      <span className="inmemso-logo__text">Inmemso</span>
    </div>
  )
}

export default InmemsoLogo
```

---

### 4. **Estilos Personalizados del Admin**

**Archivo:** `components/admin/admin.css`

```css
.inmemso-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #0f172a;
}

.inmemso-logo__mark {
  padding: 0.15rem 0.35rem;
  border: 2px solid currentColor;
  border-radius: 0.35rem;
  font-size: 0.75rem;
  line-height: 1;
}

.inmemso-logo__text {
  font-size: 0.95rem;
  text-transform: uppercase;
}
```

---

## 🔧 Comandos Post-Configuración

Después de modificar `payload.config.ts` o los componentes admin, ejecutar:

```bash
npx payload generate:importmap
```

Esto regenera el import map y asegura que Webpack resuelva correctamente las rutas de componentes personalizados.

---

## 🚨 Problemas Comunes y Soluciones

### Error: `UnhandledSchemeError: Reading from "C:Users..."`

**Causa:** Webpack no puede manejar rutas absolutas de Windows (`C:\`) directamente.

**Solución:**
- Usar alias `@/` en lugar de rutas absolutas
- Normalizar rutas con `path.posix.join()` y reemplazar `\\` por `/`

### Los estilos no se cargan en `/admin`

**Causa:** Falta importar los estilos base de Payload.

**Solución:**
```tsx
import '@payloadcms/next/css'  // En app/(payload)/layout.tsx
```

---

## 📦 Estructura de Archivos

```
inmemso-architecture/
├── app/
│   └── (payload)/
│       ├── layout.tsx          ← Importa @payloadcms/next/css
│       └── admin/
│           ├── importMap.js    ← Generado automáticamente
│           └── [[...segments]]/
│               └── page.tsx
├── components/
│   └── admin/
│       ├── InmemsoLogo.tsx     ← Logo personalizado
│       └── admin.css           ← Estilos personalizados
└── payload.config.ts           ← Configuración admin con rutas normalizadas
```

---

## ✅ Verificación

1. Ejecutar `npm run dev`
2. Visitar `http://localhost:3000/admin` (o puerto asignado)
3. Verificar que:
   - ✅ Los estilos de Payload se cargan correctamente
   - ✅ El logo personalizado se muestra
   - ✅ No hay errores de `UnhandledSchemeError`
   - ✅ La interfaz admin es completamente funcional

---

## 📝 Notas Técnicas

- **Payload CMS v3** requiere Next.js 15+
- El import `@payloadcms/next/css` carga los estilos compilados del paquete
- Los componentes personalizados deben registrarse como strings (alias) en `payload.config.ts` para que el import map los procese correctamente
- En Windows, siempre normalizar rutas con forward slashes `/` para evitar conflictos con Webpack

---

**Última actualización:** Enero 6, 2026  
**Verificado con:** Payload CMS v3 + Next.js 15.5.9
