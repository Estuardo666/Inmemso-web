/**
 * Script para iniciar Payload CMS 3.x en modo standalone
 * Solución alternativa para proyectos que no usan Next.js
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
    port: Number(process.env.PORT) || 3000,
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
  admin: {
    user: 'users',
    meta: {
      title: 'Inmemso Architecture CMS',
    },
  },
};

async function start() {
  try {
    console.log('🚀 Iniciando Payload CMS 3.x...');

    // Inicializar Payload
    await payload.init(config);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    console.log('✅ Payload CMS iniciado correctamente');
    console.log('📋 Panel Admin: http://localhost:3000/admin');
    console.log('🔌 API: http://localhost:3000/api');
    console.log('❤️  Health: http://localhost:3000/health');
    console.log('\n💡 Accede al panel admin para crear usuarios si es necesario');

  } catch (error) {
    console.error('❌ Error iniciando Payload:', error);
    process.exit(1);
  }
}

start();
