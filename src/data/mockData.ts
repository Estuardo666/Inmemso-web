/**
 * Mock Data Completo para Inmemso Architecture
 * Datos reales de la empresa con historia, proyectos y servicios
 */

import type { Service, Project, Testimonial } from '../services/payloadData';

// ============================================
// 📅 HISTORIA DE INMEMSO
// ============================================
export const companyHistory = {
  founded: 1985,
  milestone1995: 'Adopción de tecnología japonesa de construcción sismorresistente',
  mission: 'Diseñar estructuras que resistan el tiempo y la naturaleza',
  vision: 'Ser referentes en arquitectura sostenible y tecnológica'
};

// ============================================
// 🏗️ SERVICIOS
// ============================================
export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Diseño Arquitectónico',
    subtitle: 'Planificación maestra y conceptual',
    image: '/images/services/diseno-arquitectonico.jpg',
    description: 'Creamos diseños innovadores que fusionan estética, funcionalidad y sostenibilidad ambiental.',
    features: [
      { text: 'Planificación urbana', image: '/icons/urban.svg' },
      { text: 'Diseño bioclimático', image: '/icons/bioclimatic.svg' },
      { text: 'Modelado 3D BIM', image: '/icons/bim.svg' },
      { text: 'Análisis de sitio', image: '/icons/site-analysis.svg' }
    ]
  },
  {
    id: '2',
    title: 'Construcción Sismorresistente',
    subtitle: 'Tecnología japonesa de seguridad estructural',
    image: '/images/services/sismorresistente.jpg',
    description: 'Implementamos técnicas avanzadas de Japón para garantizar máxima seguridad sísmica en cada estructura.',
    features: [
      { text: 'Aislamiento sísmico', image: '/icons/seismic-isolation.svg' },
      { text: 'Estructuras de acero', image: '/icons/steel-structure.svg' },
      { text: 'Paneles prefabricados', image: '/icons/prefab.svg' },
      { text: 'Certificación internacional', image: '/icons/certified.svg' }
    ]
  },
  {
    id: '3',
    title: 'Ingeniería Estructural',
    subtitle: 'Cálculo y optimización estructural',
    image: '/images/services/ingenieria-estructural.jpg',
    description: 'Diseñamos estructuras eficientes que maximizan seguridad y minimizan costos.',
    features: [
      { text: 'Análisis estructural', image: '/icons/analysis.svg' },
      { text: 'Optimización de materiales', image: '/icons/materials.svg' },
      { text: 'Simulaciones avanzadas', image: '/icons/simulation.svg' },
      { text: 'Inspección técnica', image: '/icons/inspection.svg' }
    ]
  }
];

// ============================================
// 🏢 PROYECTOS DESTACADOS
// ============================================
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Torre Residencial "El Amanecer"',
    category: 'Residencial',
    heroImage: '/images/projects/amanecer/hero.jpg',
    description: 'Torre de 25 niveles con 120 unidades residenciales, utilizando paneles prefabricados de alta resistencia y sistema de aislamiento sísmico japonés.',
    specs: {
      client: 'Constructora del Valle',
      location: 'Ciudad de México, México',
      year: '2023',
      area: '18,500 m²'
    },
    galleryImages: [
      '/images/projects/amanecer/gallery1.jpg',
      '/images/projects/amanecer/gallery2.jpg',
      '/images/projects/amanecer/gallery3.jpg'
    ]
  },
  {
    id: '2',
    title: 'Centro Corporativo "TechHub Industrial"',
    category: 'Comercial',
    heroImage: '/images/projects/techhub-industrial/hero.jpg',
    description: 'Complejo industrial de 50,000 m² con estructuras de acero modulares, diseñado para resistir sismos de magnitud 8.0.',
    specs: {
      client: 'TechHub Industries',
      location: 'Monterrey, México',
      year: '2022',
      area: '50,000 m²'
    },
    galleryImages: [
      '/images/projects/techhub-industrial/gallery1.jpg',
      '/images/projects/techhub-industrial/gallery2.jpg',
      '/images/projects/techhub-industrial/gallery3.jpg'
    ]
  },
  {
    id: '3',
    title: 'Edificio de Oficinas "Tokyo Plaza"',
    category: 'Comercial',
    heroImage: '/images/projects/tokyo-plaza/hero.jpg',
    description: 'Proyecto emblemático que integra diseño japonés contemporáneo con tecnología de construcción prefabricada de última generación.',
    specs: {
      client: 'Grupo Tokyo-Mexico',
      location: 'Guadalajara, México',
      year: '2024',
      area: '32,000 m²'
    },
    galleryImages: [
      '/images/projects/tokyo-plaza/gallery1.jpg',
      '/images/projects/tokyo-plaza/gallery2.jpg',
      '/images/projects/tokyo-plaza/gallery3.jpg'
    ]
  },
  {
    id: '4',
    title: 'Desarrollo "Villas Sismorresistentes"',
    category: 'Residencial',
    heroImage: '/images/projects/villas-sismo/hero.jpg',
    description: 'Urbanización de 50 villas unifamiliares con estructuras de paneles prefabricados, garantizando seguridad y rapidez de construcción.',
    specs: {
      client: 'Desarrollos del Centro',
      location: 'Puebla, México',
      year: '2021',
      area: '15,000 m²'
    },
    galleryImages: [
      '/images/projects/villas-sismo/gallery1.jpg',
      '/images/projects/villas-sismo/gallery2.jpg',
      '/images/projects/villas-sismo/gallery3.jpg'
    ]
  }
];

// ============================================
// 💬 TESTIMONIOS
// ============================================
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ing. Carlos Mendoza',
    position: 'Director de Proyectos',
    company: 'Constructora del Valle',
    quote: 'Inmemso transformó nuestra visión en realidad. La tecnología japonesa de construcción que implementaron superó todas nuestras expectativas de seguridad y eficiencia.',
    image: '/images/testimonials/carlos-mendoza.jpg'
  },
  {
    id: '2',
    name: 'Dra. Patricia Ruiz',
    position: 'CEO',
    company: 'TechHub Industries',
    quote: 'El centro corporativo que construyeron es una maravilla estructural. Resiste sismos de magnitud 8.0 y se construyó 30% más rápido que proyectos tradicionales.',
    image: '/images/testimonials/patricia-ruiz.jpg'
  },
  {
    id: '3',
    name: 'Arq. Roberto Tanaka',
    position: 'Socio Director',
    company: 'Grupo Tokyo-Mexico',
    quote: 'La fusión perfecta entre diseño japonés y expertise local. Tokyo Plaza es un ícono gracias al equipo de Inmemso.',
    image: '/images/testimonials/roberto-tanaka.jpg'
  },
  {
    id: '4',
    name: 'Ing. Elena Vázquez',
    position: 'Gerente de Operaciones',
    company: 'Desarrollos del Centro',
    quote: 'Las Villas Sismorresistentes fueron un éxito total. Nuestros clientes tienen la seguridad que buscan y la calidad que merecen.',
    image: '/images/testimonials/elena-vazquez.jpg'
  }
];

// ============================================
// 🔍 UTILIDADES DE MOCK DATA
// ============================================

/**
 * Verifica si hay datos disponibles
 */
export const isMockDataAvailable = (): boolean => {
  return mockServices.length > 0 && mockProjects.length > 0;
};

/**
 * Obtiene servicios con fallback
 */
export const getMockServices = async (): Promise<Service[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockServices), 100); // Simula delay de API
  });
};

/**
 * Obtiene proyectos con fallback
 */
export const getMockProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProjects), 100);
  });
};

/**
 * Obtiene testimonios con fallback
 */
export const getMockTestimonials = async (): Promise<Testimonial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTestimonials), 100);
  });
};

/**
 * Busca servicio por ID
 */
export const findMockServiceById = (id: string): Service | null => {
  return mockServices.find(s => s.id === id) || null;
};

/**
 * Busca proyecto por ID
 */
export const findMockProjectById = (id: string): Project | null => {
  return mockProjects.find(p => p.id === id) || null;
};
