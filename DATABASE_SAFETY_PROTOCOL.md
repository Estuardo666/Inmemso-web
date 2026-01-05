# 🔒 Protocolo de Seguridad para Base de Datos (Inmemso)

## Principio Fundamental: "Dumb Client, Smart DB"

Nunca confíes en que Payload CMS o Prisma Client envíen valores por defecto. La base de datos DEBE ser autosuficiente para rellenar valores faltantes.

---

## Reglas Obligatorias para schema.prisma

### 1. IDs (Primary Keys)
```prisma
// ✅ CORRECTO: UUID generado por DB
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid

// ❌ INCORRECTO: CUID generado por JS (Payload lo ignora)
id String @id @default(cuid())

// ❌ INCORRECTO: Sin default (NULL constraint error)
id String @id
```

**Por qué:** Payload CMS inserta directamente en PostgreSQL sin pasar por Prisma Client. Si el ID no tiene un default a nivel SQL, la insert falla con "null value in column id".

---

### 2. Fechas de Sistema (createdAt, updatedAt)
```prisma
// ✅ CORRECTO: Ambas tienen @default(now())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

// ❌ INCORRECTO: updatedAt sin @default(now())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")  // NULL en primer INSERT

// ❌ INCORRECTO: Sin mapeo a snake_case (Payload CMS los busca así)
createdAt DateTime @default(now())  // Sin @map -> "createdAt" pero Payload busca "created_at"
updatedAt DateTime @updatedAt
```

**Por qué:** 
- `@default(now())` en ambos campos asegura que PostgreSQL rellena el timestamp en el primer INSERT.
- `@updatedAt` en `updatedAt` permite que Prisma Client lo actualice automáticamente en UPDATEs posteriores.
- `@map("snake_case")` es crítico porque Payload CMS usa snake_case en sus queries internas.

---

### 3. Llaves Foráneas (Foreign Keys / Relations Scalars)
```prisma
// ✅ CORRECTO: FK también es UUID si el padre es UUID
model Session {
  id       String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user     User   @relation(fields: [parentId], references: [id], onDelete: Cascade)
  parentId String @map("_parent_id") @db.Uuid  // <-- MISMO TIPO QUE User.id
}

// ❌ INCORRECTO: Mismatch de tipos (text = uuid error)
model Session {
  id       String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user     User   @relation(fields: [parentId], references: [id], onDelete: Cascade)
  parentId String @map("_parent_id")  // <-- TEXT, pero User.id es UUID → JOIN error
}
```

**Por qué:** PostgreSQL no puede hacer JOIN entre tipos diferentes. Si padre es UUID, hijo DEBE ser UUID.

---

### 4. Campos Booleanos e Integers Obligatorios
```prisma
// ✅ CORRECTO: Siempre tiene un @default
loginAttempts Int? @default(0) @map("login_attempts")
isActive      Boolean @default(true)

// ❌ INCORRECTO: Sin default (NULL constraint si NOT NULL)
loginAttempts Int  // Sin default → NULL error en Payload insert
isActive      Boolean  // Sin default → NULL error
```

**Por qué:** Si una columna es `NOT NULL` (sin `?` en Prisma), debe tener un valor por defecto a nivel SQL.

---

### 5. Mapeos Snake_Case para Auth (Payload)
```prisma
// ✅ CORRECTO: Auth fields mapeados a snake_case
salt                    String? // Payload busca 'salt' (case-sensitive)
hash                    String? // Payload busca 'hash'
loginAttempts           Int? @default(0) @map("login_attempts")
lockUntil               DateTime? @map("lock_until")
resetPasswordToken      String? @map("reset_password_token")
resetPasswordExpiration DateTime? @map("reset_password_expiration")

// ❌ INCORRECTO: Sin mapeo (Payload no los encuentra)
loginAttempts Int? @default(0)  // → DB tiene "loginAttempts", Payload busca "login_attempts"
```

**Por qué:** Payload CMS v3 genera queries usando nombres snake_case internamente. Si no mapeas, Payload no puede leer/escribir esos campos.

---

## Checklist antes de hacer `npx prisma db push`

- [ ] Todos los `id` fields tienen `@default(dbgenerated("gen_random_uuid()"))` y `@db.Uuid`?
- [ ] Todos los `createdAt` tienen `@default(now())` y `@map("created_at")`?
- [ ] Todos los `updatedAt` tienen **AMBOS** `@default(now())` Y `@updatedAt` y `@map("updated_at")`?
- [ ] Todas las FKs que referencian UUIDs también son `@db.Uuid`?
- [ ] Campos críticos de Auth (`loginAttempts`, `lockUntil`, etc.) tienen `@map` a snake_case?
- [ ] Campos `NOT NULL` (sin `?`) tienen `@default(valor)`?
- [ ] El `postgresAdapter` tiene `idType: 'uuid'`?

---

## Comandos de Sincronización

```bash
# Actualizar esquema sin perder datos (preferido)
npx prisma db push

# Resetear COMPLETAMENTE la base de datos (solo en desarrollo/testing)
npx prisma db push --force-reset --accept-data-loss

# Generar tipos TypeScript del cliente Prisma
npx prisma generate

# Inspeccionar la DB interactivamente
npx prisma studio
```

---

## Ejemplos Reales (del Proyecto)

### ✅ User Model (CORRECTO)
```prisma
model User {
  id                      String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email                   String    @unique
  
  // Auth fields
  salt                    String?
  hash                    String?
  loginAttempts           Int?      @default(0) @map("login_attempts")
  lockUntil               DateTime? @map("lock_until")
  resetPasswordToken      String?   @map("reset_password_token")
  resetPasswordExpiration DateTime? @map("reset_password_expiration")
  
  // Dates (ambos con @default(now()))
  createdAt               DateTime  @default(now()) @map("created_at")
  updatedAt               DateTime  @default(now()) @updatedAt @map("updated_at")
  
  sessions                Session[]
  
  @@map("users")
}
```

### ✅ Session Model (CORRECTO)
```prisma
model Session {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  parentId  String   @map("_parent_id") @db.Uuid  // <-- FK también es UUID
  user      User     @relation(fields: [parentId], references: [id], onDelete: Cascade)
  
  token     String
  expiresAt DateTime @map("expires_at")
  order     Int?     @map("_order")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")
  
  @@map("users_sessions")
}
```

---

## Errores Comunes y Soluciones

### ❌ Error: `null value in column "id" violates not-null constraint`
**Causa:** El `id` field no tiene `@default(dbgenerated(...))` a nivel SQL.
**Solución:**
```prisma
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
```

### ❌ Error: `null value in column "updated_at" violates not-null constraint`
**Causa:** El campo `updatedAt` NO tiene `@default(now())`.
**Solución:**
```prisma
updatedAt DateTime @default(now()) @updatedAt @map("updated_at")
```

### ❌ Error: `operator does not exist: text = uuid`
**Causa:** FK tiene tipo TEXT pero el padre es UUID.
**Solución:** Agregar `@db.Uuid` al campo FK.
```prisma
parentId String @map("_parent_id") @db.Uuid
```

### ❌ Error: `Cannot destructure property 'lockUntil' of ... as it is null`
**Causa:** Combination de:
  1. Campo `lockUntil` sin `@map("lock_until")`
  2. O `idType` no es `'uuid'` en `postgresAdapter`
**Solución:**
```prisma
// En schema.prisma:
lockUntil DateTime? @map("lock_until")

// En payload.config.ts:
db: postgresAdapter({
  idType: 'uuid',
  // ...
})
```

---

## Integración con Cursor/Claude AI

Si usas este protocolo con un AI assistant (Cursor, Kilo Code, Claude), puedes pegar este prompt antes de hacer cambios:

```
Antes de mostrarme cambios a prisma/schema.prisma, ejecuta este análisis:

1. ¿Todos los `id` tienen `@default(dbgenerated("gen_random_uuid()"))` y `@db.Uuid`?
2. ¿Todos los `createdAt` y `updatedAt` tienen `@default(now())`?
3. ¿Las FKs que apuntan a UUIDs también son `@db.Uuid`?
4. ¿Los campos de Auth tienen `@map` a snake_case?

Si alguno falla, DETENTE y explícame el error antes de mostrar código.
```

---

## Referencias
- **Payload CMS v3 Docs:** https://payloadcms.com/docs
- **Prisma Relations:** https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#relation
- **PostgreSQL Defaults:** https://www.postgresql.org/docs/current/sql-syntax.html
