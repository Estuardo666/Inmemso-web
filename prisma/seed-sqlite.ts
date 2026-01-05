/**
 * Script de seed para SQLite con datos de desarrollo
 * Carga los datos mock directamente en la base de datos SQLite
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: null, // Para SQLite, no se necesita adapter en Prisma 7
});

/**
 * Limpia la base de datos antes de sembrar
 */
async function cleanDatabase() {
  console.log('\n🗑️  Limpiando base de datos SQLite...');
  
  try {
    // Eliminar en orden inverso para respetar restricciones de clave foránea
    await prisma.projectTechnology.deleteMany();
    await prisma.projectService.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.project.deleteMany();
    await prisma.service.deleteMany();
    await prisma.media.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('✅ Base de datos limpia');
  } catch (error) {
    console.warn('⚠️  Error limpiando base de datos:', error);
  }
}

/**
 * Datos mock para desarrollo local
 */
const mockServices = [
  {
    id: '1',
    title: 'Arquitectura Residencial',
    subtitle: 'Diseño de casas modernas',
    description: 'Creamos espacios habitacionales que combinan funcionalidad y estética moderna.',
  },
  {
    id: '2',
    title: 'Arquitectura Comercial',
    subtitle: 'Espacios para negocios',
    description: 'Diseñamos espacios comerciales que impulsan tu negocio y reflejan tu marca.',
  },
  {
    id: '3',
    title: 'Diseño de Interiores',
    subtitle: 'Ambientes que inspiran',
    description: 'Transformamos espacios interiores en ambientes funcionales y hermosos.',
  }
];

const mockProjects = [
  {
    id: '1',
    title: 'Casa Vista Mar',
    description: 'Una residencia moderna con vistas al mar, diseñada para maximizar la conexión con el entorno natural.',
    year: '2024',
  },
  {
    id: '2',
    title: 'Oficinas TechHub',
    description: 'Espacio de trabajo colaborativo para startups tecnológicas, con énfasis en flexibilidad y bienestar.',
    year: '2024',
  },
  {
    id: '3',
    title: 'Loft Industrial',
    description: 'Rehabilitación de nave industrial en loft de diseño contemporáneo.',
    year: '2023',
  }
];

const mockTestimonials = [
  {
    id: '1',
    name: 'María González',
    position: 'CEO',
    company: 'González Properties',
    quote: 'El equipo de Inmemso transformó nuestra visión en realidad. Profesionalismo y creatividad en cada detalle.',
    image: '/images/testimonials/maria.jpg'
  },
  {
    id: '2',
    name: 'Roberto Fernández',
    position: 'Director',
    company: 'TechHub Ventures',
    quote: 'Excelente trabajo en nuestras oficinas. El diseño ha mejorado significativamente la productividad de nuestro equipo.',
    image: '/images/testimonials/roberto.jpg'
  },
  {
    id: '3',
    name: 'Ana López',
    position: 'Propietaria',
    company: 'Casa Vista Mar',
    quote: 'Superaron todas nuestras expectativas. La casa es perfecta para nuestra familia.',
    image: '/images/testimonials/ana.jpg'
  }
];

/**
 * Convierte datos de mock a formato Prisma
 */
function convertMockToPrisma() {
  // Servicios
  const services = mockServices.map(service => ({
    id: service.id,
    title: service.title,
    slug: service.title.toLowerCase().replace(/\s+/g, '-'),
    description: service.description,
    content: service.subtitle, // Usamos subtitle como contenido
    icon: null,
    featuredImageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Proyectos
  const projects = mockProjects.map(project => ({
    id: project.id,
    title: project.title,
    slug: project.title.toLowerCase().replace(/\s+/g, '-'),
    description: project.description,
    content: project.description, // Usamos description como contenido
    featuredImageId: null,
    year: project.year,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Testimonios
  const testimonials = mockTestimonials.map(testimonial => ({
    id: testimonial.id,
    name: testimonial.name,
    position: testimonial.position,
    company: testimonial.company,
    quote: testimonial.quote,
    image: testimonial.image,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Relaciones Proyecto-Servicio (simplificadas)
  const projectServices = [
    { id: '1', projectId: '1', service: 'Arquitectura Residencial' },
    { id: '2', projectId: '2', service: 'Arquitectura Comercial' },
    { id: '3', projectId: '3', service: 'Diseño de Interiores' },
  ];

  // Relaciones Proyecto-Tecnología (simplificadas)
  const projectTechnologies = [
    { id: '1', projectId: '1', technology: 'Sostenible' },
    { id: '2', projectId: '1', technology: 'Moderno' },
    { id: '3', projectId: '2', technology: 'Eficiente' },
    { id: '4', projectId: '2', technology: 'Colaborativo' },
    { id: '5', projectId: '3', technology: 'Industrial' },
    { id: '6', projectId: '3', technology: 'Contemporáneo' },
  ];

  return { services, projects, testimonials, projectServices, projectTechnologies };
}

/**
 * Sembrar datos en la base de datos
 */
async function seedDatabase() {
  console.log('\n🌱 Sembrando datos de desarrollo en SQLite...\n');

  const { services, projects, testimonials, projectServices, projectTechnologies } = convertMockToPrisma();

  // Insertar usuarios (un usuario admin de prueba)
  console.log('👤 Insertando usuario admin...');
  await prisma.user.create({
    data: {
      id: 'admin-001',
      name: 'Administrador',
      email: 'admin@inmemso.com',
      password: 'admin123', // En producción, esto debería estar hasheado
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('  ✅ Usuario admin creado');

  // Insertar servicios
  console.log('\n🔧 Insertando servicios...');
  for (const service of services) {
    try {
      await prisma.service.create({ data: service });
      console.log(`  ✅ ${service.title}`);
    } catch (error) {
      console.error(`  ❌ Error con servicio ${service.title}:`, error);
    }
  }

  // Insertar proyectos
  console.log('\n🏗️  Insertando proyectos...');
  for (const project of projects) {
    try {
      await prisma.project.create({ data: project });
      console.log(`  ✅ ${project.title}`);
    } catch (error) {
      console.error(`  ❌ Error con proyecto ${project.title}:`, error);
    }
  }

  // Insertar testimonios
  console.log('\n💬 Insertando testimonios...');
  for (const testimonial of testimonials) {
    try {
      await prisma.testimonial.create({ data: testimonial });
      console.log(`  ✅ ${testimonial.name}`);
    } catch (error) {
      console.error(`  ❌ Error con testimonio ${testimonial.name}:`, error);
    }
  }

  // Insertar relaciones Proyecto-Servicio
  console.log('\n🔗 Insertando relaciones Proyecto-Servicio...');
  for (const rel of projectServices) {
    try {
      await prisma.projectService.create({ data: rel });
      console.log(`  ✅ Proyecto ${rel.projectId} -> Servicio ${rel.service}`);
    } catch (error) {
      console.error(`  ❌ Error con relación:`, error);
    }
  }

  // Insertar relaciones Proyecto-Tecnología
  console.log('\n🔗 Insertando relaciones Proyecto-Tecnología...');
  for (const rel of projectTechnologies) {
    try {
      await prisma.projectTechnology.create({ data: rel });
      console.log(`  ✅ Proyecto ${rel.projectId} -> Tecnología ${rel.technology}`);
    } catch (error) {
      console.error(`  ❌ Error con relación:`, error);
    }
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando seed de SQLite para desarrollo...\n');

  try {
    await cleanDatabase();
    await seedDatabase();

    console.log('\n🎉 ¡SEED COMPLETADO CON ÉXITO! 🎉');
    console.log('\n📊 Resumen:');
    
    const userCount = await prisma.user.count();
    const serviceCount = await prisma.service.count();
    const projectCount = await prisma.project.count();
    const testimonialCount = await prisma.testimonial.count();
    const projectServiceCount = await prisma.projectService.count();
    const projectTechnologyCount = await prisma.projectTechnology.count();

    console.log(`  - Usuarios: ${userCount}`);
    console.log(`  - Servicios: ${serviceCount}`);
    console.log(`  - Proyectos: ${projectCount}`);
    console.log(`  - Testimonios: ${testimonialCount}`);
    console.log(`  - Relaciones Proyecto-Servicio: ${projectServiceCount}`);
    console.log(`  - Relaciones Proyecto-Tecnología: ${projectTechnologyCount}`);
    
    console.log('\n✅ Base de datos SQLite lista para desarrollo local');
    console.log('💡 Puedes iniciar el servidor con: npm run dev:cms');
    
  } catch (error) {
    console.error('\n❌ ERROR EN EL SEED:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión a SQLite cerrada');
  }
}

// Ejecutar el script
main();
