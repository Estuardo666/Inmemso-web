#!/usr/bin/env node
/**
 * Script de configuración de base de datos cloud para Inmemso Architecture
 * Ejecuta este script para configurar la conexión a Neon.tech o Supabase
 */

const fs = require('fs');
const path = require('path');

// Configuración recomendada para Neon.tech
const neonConfig = {
  DATABASE_URL: "postgresql://inmemso_user:YOUR_SECURE_PASSWORD@ep-your-project-123456.us-east-2.aws.neon.tech/inmemso?sslmode=require&connect_timeout=10",
  DATABASE_URI: "postgresql://inmemso_user:YOUR_SECURE_PASSWORD@ep-your-project-123456.us-east-2.aws.neon.tech/inmemso?sslmode=require&connect_timeout=10",
  PRISMA_DATABASE_URL: "postgresql://inmemso_user:YOUR_SECURE_PASSWORD@ep-your-project-123456.us-east-2.aws.neon.tech/inmemso?sslmode=require&connect_timeout=10"
};

// Configuración alternativa para Supabase
const supabaseConfig = {
  DATABASE_URL: "postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxx.supabase.co:5432/postgres",
  DATABASE_URI: "postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxx.supabase.co:5432/postgres",
  PRISMA_DATABASE_URL: "postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxx.supabase.co:5432/postgres"
};

console.log('🔧 Configuración de Base de Datos Cloud - Inmemso Architecture\n');

console.log('📋 PASO 1: Obtén tu URL de conexión');
console.log('   - Neon.tech: Crea una base de datos en https://console.neon.tech');
console.log('   - Supabase: Crea un proyecto en https://supabase.com');
console.log('   - Copia la URL de conexión completa\n');

console.log('📋 PASO 2: Actualiza tu archivo .env.local con:');
console.log('\n--- NEON.TECH (RECOMENDADO) ---');
console.log(`DATABASE_URL="${neonConfig.DATABASE_URL}"`);
console.log(`DATABASE_URI="${neonConfig.DATABASE_URI}"`);
console.log(`PRISMA_DATABASE_URL="${neonConfig.PRISMA_DATABASE_URL}"`);

console.log('\n--- SUPABASE (ALTERNATIVA) ---');
console.log(`DATABASE_URL="${supabaseConfig.DATABASE_URL}"`);
console.log(`DATABASE_URI="${supabaseConfig.DATABASE_URI}"`);
console.log(`PRISMA_DATABASE_URL="${supabaseConfig.PRISMA_DATABASE_URL}"`);

console.log('\n📋 PASO 3: Ejecuta estos comandos:');
console.log('   1. npx prisma db push');
console.log('   2. npx ts-node prisma/migrate-data.ts');
console.log('   3. npm run dev\n');

console.log('✅ Una vez configurado, el equipo puede acceder desde cualquier lugar');
console.log('✅ Despliegue en Vercel: solo agrega las variables en el dashboard\n');

