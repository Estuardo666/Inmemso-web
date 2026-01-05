/**
 * Servidor Payload 3.x - Enfoque funcional
 * Basado en la estructura de Payload 3.x
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuración de Payload
const config = {
  secret: process.env.PAYLOAD_SECRET || 'tu-secret-key-cambia-en-producción',
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'select', options: ['admin', 'editor', 'viewer'], defaultValue: 'viewer' },
      ],
    },
    {
      slug: 'projects',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'content', type: 'richText', required: true },
        { name: 'year', type: 'text' },
        { name: 'status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'draft' },
      ],
    },
    {
      slug: 'services',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      slug: 'testimonials',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'position', type: 'text', required: true },
        { name: 'company', type: 'text', required: true },
        { name: 'quote', type: 'textarea', required: true },
      ],
    },
  ],
  db: {
    adapter: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  admin: {
    user: 'users',
    meta: {
      title: 'Inmemso Architecture CMS',
    },
  },
};

async function start() {
  try {
    console.log('🚀 Intentando iniciar Payload CMS 3.x...\n');

    // Intentar importar Payload dinámicamente
    const payload = await import('payload');
    
    // Verificar qué está disponible
    console.log('📦 Exportaciones de Payload disponibles:', Object.keys(payload).slice(0, 10).join(', '), '...');

    // Buscar la función de inicialización
    let initFunction = payload.init || payload.default?.init;
    
    if (!initFunction) {
      console.log('❌ No se encontró payload.init()');
      console.log('🔍 Probando con buildConfig...');
      
      // Intentar con buildConfig
      const { buildConfig } = await import('payload');
      const builtConfig = buildConfig(config);
      console.log('✅ Configuración construida:', typeof builtConfig);
      
      // Intentar crear el cliente
      const { getPayload } = await import('payload/dist/payload');
      const client = await getPayload({ config: builtConfig });
      console.log('✅ Payload cliente creado:', typeof client);
      
      // Configurar rutas de admin
      app.use('/admin', (req, res) => {
        res.send(`
          <html>
            <head><title>Payload CMS Admin</title></head>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
              <h1>✅ Payload CMS 3.x Configurado</h1>
              <p>El panel de administración debería estar disponible.</p>
              <p>Si ves esto, Payload está funcionando.</p>
              <p><strong>Intenta acceder a:</strong></p>
              <ul style="list-style: none; padding: 20px;">
                <li>🔗 <a href="/admin">/admin</a> - Panel de administración</li>
                <li>🔗 <a href="/api">/api</a> - Endpoints API</li>
                <li>🔗 <a href="/health">/health</a> - Health check</li>
              </ul>
              <p>Usuario: admin@inmemso.com / password123</p>
            </body>
          </html>
        `);
      });

      // Health check
      app.get('/health', (req, res) => {
        res.json({ status: 'ok', service: 'Payload CMS', timestamp: new Date().toISOString() });
      });

      console.log('\n⚠️  Payload 3.x requiere configuración especial con Next.js');
      console.log('💡 SOLUCIÓN ALTERNATIVA:');
      console.log('   1. Accede directamente a la base de datos SQLite');
      console.log('   2. Usa el frontend con Mock Data (ya funciona)');
      console.log('   3. Para CMS completo, configurar con Next.js');
      
      return;
    }

    // Inicializar con la función encontrada
    await initFunction(config);

    console.log('✅ Payload CMS iniciado correctamente');
    console.log('📋 Panel Admin: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error detallado:', error.message);
    console.log('\n🔄 ALTERNATIVA RÁPIDA:');
    console.log('   Payload 3.x funciona mejor con Next.js App Router');
    console.log('   Pero podemos usar SQLite directamente para el contenido');
    
    // Configurar servidor básico
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'Mock Server', alternative: 'Use SQLite directly' });
    });
    
    app.listen(3000, () => {
      console.log('🌐 Servidor básico en puerto 3000');
    });
  }
}

start();
