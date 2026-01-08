# Script para verificar si los datos estan en PostgreSQL
# Ejecutar con: psql $env:DATABASE_URL -c "SELECT * FROM payload_globals WHERE key = 'home';"

SELECT 
  id,
  key,
  value as data_preview,
  LENGTH(value::text) as data_length,
  updated_at,
  created_at
FROM payload_globals 
WHERE key = 'home' 
LIMIT 1;

-- Si no hay datos, verifica que la tabla existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'payload_globals';

-- Ver todas las globals disponibles
SELECT DISTINCT key FROM payload_globals;
