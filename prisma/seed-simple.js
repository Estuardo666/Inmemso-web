/**
 * Script de seed simple para SQLite
 * Usa Prisma Client directamente
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Datos mock
const mockServices = [
  {
    id: '1',
    title: 'Arquitectura Residencial',
    slug: 'arquitectura-residencial',
    description: 'Creamos espacios habitacionales que combinan funcionalidad y estética moderna.',
    content: 'Diseño de casas modernas',
    icon: null,
    featuredImageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Arquitectura Comercial',
    slug: 'arquitectura-comercial',
    description: 'Diseñamos espacios comerciales que impulsan tu negocio y reflejan tu marca.',
    content: 'Espacios para negocios',
    icon: null,
    featuredImageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Diseño de Interiores',
    slug: 'diseno-de-interiores',
    description: 'Transformamos espacios interiores en ambientes funcionales y hermosos.',
    content: 'Ambientes que inspiran',
    icon: null,
    featuredImageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockProjects = [
  {
    id: '1',
    title: 'Casa Vista Mar',
    slug: 'casa-vista-mar',
    description: 'Una residencia moderna con vistas al mar, diseñada para maximizar la conexión con el entorno natural.',
    content: 'Una residencia moderna con vistas al mar',
    featuredImageId: null,
    year: '2024',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Oficinas TechHub',
    slug: 'oficinas-techhub',
    description: 'Espacio de trabajo colaborativo para startups tecnológicas, con énfasis en flexibilidad y bienestar.',
    content: 'Espacio de trabajo colaborativo',
    featuredImageId: null,
    year: '2024',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Loft Industrial',
    slug: 'loft-industrial',
    description: 'Rehabilitación de nave industrial en loft de diseño contemporáneo.',
    content: 'Rehabilitación de nave industrial',
    featuredImageId: null,
    year: '2023',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockTestimonials = [
  {
    id: '1',
    name: 'María González',
    position: 'CEO',
    company: 'González Properties',
    quote: 'El equipo de Inmemso transformó nuestra visión en realidad. Profesionalismo y creatividad en cada detalle.',
    image: '/images/testimonials/maria.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Roberto Fernández',
    position: 'Director',
    company: 'TechHub Ventures',
    quote: 'Excelente trabajo en nuestras oficinas. El diseño ha mejorado significativamente la productividad de nuestro equipo.',
    image: '/images/testimonials/roberto.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Ana López',
    position: 'Propietaria',
    company: 'Casa Vista Mar',
    quote: 'Superaron todas nuestras expectativas. La casa es perfecta para nuestra familia.',
    image: '/images/testimonials/ana.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const projectServices = [
  { id: '1', projectId: '1', service: 'Arquitectura Residencial' },
  { id: '2', projectId: '2', service: 'Arquitectura Comercial' },
  { id: '3', projectId: '3', service: 'Diseño de Interiores' },
];

const projectTechnologies = [
  { id: '1', projectId: '1', technology: 'Sostenible' },
  { id: '2', projectId: '1', technology: 'Moderno' },
  { id: '3', projectId: '2', technology: 'Eficiente' },
  { id: '4', projectId: '2', technology: 'Colaborativo' },
  { id: '5', projectId: '3', technology: 'Industrial' },
  { id: '6', projectId: '3', technology: 'Contemporáneo' },
];

async function main() {
  console.log('🚀 Iniciando seed de SQLite...\n');

  try {
    // Limpiar base de datos
    console.log('🗑️  Limpiando base de datos...');
    await prisma.project_technologies.deleteMany();
    await prisma.project_services.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.project.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Base de datos limpia\n');

    // Insertar usuario admin
    console.log('👤 Insertando usuario admin...');
    await prisma.user.create({
      data: {
        id: 'admin-001',
        name: 'Administrador',
        email: 'admin@inmemso.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('  ✅ Usuario admin creado\n');

    // Insertar servicios
    console.log('🔧 Insertando servicios...');
    for (const service of mockServices) {
      await prisma.service.create({ data: service });
      console.log(`  ✅ ${service.title}`);
    }

    // Insertar proyectos
    console.log('\n🏗️  Insertando proyectos...');
    for (const project of mockProjects) {
      await prisma.project.create({ data: project });
      console.log(`  ✅ ${project.title}`);
    }

    // Insertar testimonios
    console.log('\n💬 Insertando testimonios...');
    for (const testimonial of mockTestimonials) {
      await prisma.testimonial.create({ data: testimonial });
      console.log(`  ✅ ${testimonial.name}`);
    }

    // Insertar relaciones
    console.log('\n🔗 Insertando relaciones...');
    for (const rel of projectServices) {
      await prisma.project_services.create({ data: rel });
      console.log(`  ✅ Proyecto ${rel.projectId} -> Servicio ${rel.service}`);
    }
    for (const rel of projectTechnologies) {
      await prisma.project_technologies.create({ data: rel });
      console.log(`  ✅ Proyecto ${rel.projectId} -> Tecnología ${rel.technology}`);
    }

    console.log('\n🎉 ¡SEED COMPLETADO CON ÉXITO! 🎉');
    
    // Resumen
    const userCount = await prisma.user.count();
    const serviceCount = await prisma.service.count();
    const projectCount = await prisma.project.count();
    const testimonialCount = await prisma.testimonial.count();
    
    console.log('\n📊 Resumen:');
    console.log(`  - Usuarios: ${userCount}`);
    console.log(`  - Servicios: ${serviceCount}`);
    console.log(`  - Proyectos: ${projectCount}`);
    console.log(`  - Testimonios: ${testimonialCount}`);
    console.log('\n✅ Base de datos SQLite lista para desarrollo local');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

main();
