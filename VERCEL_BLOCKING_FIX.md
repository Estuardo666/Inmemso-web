# 🚨 SOLUCIÓN URGENTE: Payload bloqueado en Vercel

## Problema
Payload está preguntando interactivamente en Vercel, bloqueando toda la app (timeouts de 15s en todos los endpoints).

## ✅ Solución (2 pasos)

### Paso 1: Marcar migraciones como aplicadas en Neon

1. Ir a: https://console.neon.tech/app/projects
2. Abrir tu proyecto Inmemso → **SQL Editor**
3. Copiar y ejecutar este SQL:

```sql
CREATE TABLE IF NOT EXISTS payload_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  batch INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payload_migrations (name, batch) VALUES
('20260105_114119', 1),
('20260105_151200_fix_users_sessions', 1),
('20260105_212900_fix_payload_preferences_rels', 1),
('20260106_113818', 1),
('20260107_000000_ensure_users_sessions_updated_at', 1),
('20260107_fix_sessions_defaults', 1),
('20260108_205146', 1)
ON CONFLICT (name) DO NOTHING;
```

4. Verificar que se insertaron:
```sql
SELECT * FROM payload_migrations ORDER BY batch, id;
```

### Paso 2: Redeploy en Vercel

1. Ir a: https://vercel.com/stuarts-projects-bdd60b3d/inmemso-web/deployments
2. Clic en el último deployment → **⋯** (tres puntos) → **Redeploy**
3. Esperar 2-3 minutos

## ✅ Verificación

- `/admin` debe cargar SIN prompts
- `/api/globals/home` debe responder en <2s
- Frontend debe mostrar datos del CMS

## 🔧 Variables de Entorno Recomendadas

Agregar en Vercel → Settings → Environment Variables:

```
PAYLOAD_TELEMETRY_DISABLED=true
NODE_ENV=production
```

## 📋 Estado Actual del Código

- ✅ `push: false` configurado (no más prompts futuros)
- ✅ Todas las migraciones generadas y registradas
- ✅ Build pasa correctamente

Solo falta marcar las migraciones en la DB de producción.

