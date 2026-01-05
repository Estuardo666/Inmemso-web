/**
 * Servidor Payload CMS 3.x para Panel de Administración
 * Corre en puerto 3000
 */

const express = require('express');
const payload = require('payload');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuración de Payload
const config = {
  secret: process.env.PAYLOAD_SECRET || 'tu-secret-key-cambia-en-producción',
  express: {
    port: 3000,
    app,
  },
  db: {
    adapter: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
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
        { name: 'featuredImage', type: 'upload', relationTo: 'media' },
        { name: 'services', type: 'array', fields: [{ name: 'service', type: 'text' }] },
        { name: 'technologies', type: 'array', fields: [{ name: 'technology', type: 'text' }] },
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
        { name: 'content', type: 'richText' },
        { name: 'icon', type: 'text' },
        { name: 'featuredImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      slug: 'media',
      fields: [
        { name: 'alt', type: 'text', required: true },
      ],
    },
    {
      slug: 'testimonials',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'position', type: 'text', required: true },
        { name: 'company', type: 'text', required: true },
        { name: 'quote', type: 'textarea', required: true },
        { name: 'image', type: 'text' },
      ],
    },
  ],
  admin: {
    user: 'users',
    meta: {
      title: 'Inmemso Architecture CMS',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    },
  },
};

async function start() {
  try {
    console.log('🚀 Iniciando Payload CMS 3.x...\n');

    // Inicializar Payload
    await payload.init(config);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Payload CMS'
      });
    });

    console.log('✅ PAYLOAD CMS INICIADO CORRECTAMENTE');
    console.log('');
    console.log('📋 ACCESO AL PANEL DE ADMINISTRACIÓN:');
    console.log('   URL: http://localhost:3000/admin');
    console.log('');
    console.log('🔑 CREDENCIALES DE LOGIN:');
    console.log('   Email: admin@inmemso.com');
    console.log('   Password: password123');
    console.log('');
    console.log('🔌 ENDPOINTS DE API:');
    console.log('   - http://localhost:3000/api/projects');
    console.log('   - http://localhost:3000/api/services');
    console.log('   - http://localhost:3000/api/testimonials');
    console.log('   - http://localhost:3000/api/users');
    console.log('');
    console.log('❤️  HEALTH CHECK: http://localhost:3000/health');
    console.log('');
    console.log('💡 CONSEJO: Mantén este servidor corriendo en una terminal separada');
    console.log('   y usa "npm run dev" en otra terminal para el frontend (Vite).');
    console.log('');
    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('   1. Abre http://localhost:3000/admin en tu navegador');
    console.log('   2. Inicia sesión con las credenciales de arriba');
    console.log('   3. Ve a "Projects" o "Services" para agregar contenido real');
    console.log('   4. Los cambios se reflejarán automáticamente en el frontend');

  } catch (error) {
    console.error('❌ Error iniciando Payload:', error);
    process.exit(1);
  }
}

start();
