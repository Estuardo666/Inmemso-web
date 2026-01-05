/**
 * Mock Data para desarrollo local
 * Proporciona datos de prueba cuando Payload CMS no está disponible
 */

import type { Service, Project, Testimonial } from './payloadData';

// Mock de servicios
export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Arquitectura Residencial',
    subtitle: 'Diseño de casas modernas',
    image: '/images/services/residential.jpg',
    description: 'Creamos espacios habitacionales que combinan funcionalidad y estética moderna.',
    features: [
      { text: 'Diseño personalizado', image: '/icons/custom.svg' },
      { text: 'Sostenibilidad', image: '/icons/eco.svg' },
      { text: 'Proyectos llave en mano', image: '/icons/turnkey.svg' }
    ]
  },
  {
    id: '2',
    title: 'Arquitectura Comercial',
    subtitle: 'Espacios para negocios',
    image: '/images/services/commercial.jpg',
    description: 'Diseñamos espacios comerciales que impulsan tu negocio y reflejan tu marca.',
    features: [
      { text: 'Optimización de espacio', image: '/icons/space.svg' },
      { text: 'Identidad corporativa', image: '/icons/brand.svg' },
      { text: 'Cumplimiento normativo', image: '/icons/compliance.svg' }
    ]
  },
  {
    id: '3',
    title: 'Diseño de Interiores',
    subtitle: 'Ambientes que inspiran',
    image: '/images/services/interior.jpg',
    description: 'Transformamos espacios interiores en ambientes funcionales y hermosos.',
    features: [
      { text: 'Planificación 3D', image: '/icons/3d.svg' },
      { text: 'Selección de materiales', image: '/icons/materials.svg' },
      { text: 'Mobiliario a medida', image: '/icons/furniture.svg' }
    ]
  }
];

// Mock de proyectos
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Casa Vista Mar',
    category: 'Residencial',
    heroImage: '/images/projects/vista-mar/hero.jpg',
    description: 'Una residencia moderna con vistas al mar, diseñada para maximizar la conexión con el entorno natural.',
    specs: {
      client: 'Familia Rodríguez',
      location: 'Marbella, Málaga',
      year: '2024',
      area: '450 m²'
    },
    galleryImages: [
      '/images/projects/vista-mar/gallery1.jpg',
      '/images/projects/vista-mar/gallery2.jpg',
      '/images/projects/vista-mar/gallery3.jpg'
    ]
  },
  {
    id: '2',
    title: 'Oficinas TechHub',
    category: 'Comercial',
    heroImage: '/images/projects/techhub/hero.jpg',
    description: 'Espacio de trabajo colaborativo para startups tecnológicas, con énfasis en flexibilidad y bienestar.',
    specs: {
      client: 'TechHub Ventures',
      location: 'Madrid, España',
      year: '2024',
      area: '800 m²'
    },
    galleryImages: [
      '/images/projects/techhub/gallery1.jpg',
      '/images/projects/techhub/gallery2.jpg',
      '/images/projects/techhub/gallery3.jpg'
    ]
  },
  {
    id: '3',
    title: 'Loft Industrial',
    category: 'Residencial',
    heroImage: '/images/projects/loft/hero.jpg',
    description: 'Rehabilitación de nave industrial en loft de diseño contemporáneo.',
    specs: {
      client: 'Carlos Méndez',
      location: 'Barcelona, España',
      year: '2023',
      area: '180 m²'
    },
    galleryImages: [
      '/images/projects/loft/gallery1.jpg',
      '/images/projects/loft/gallery2.jpg',
      '/images/projects/loft/gallery3.jpg'
    ]
  }
];

// Mock de testimonios
export const mockTestimonials: Testimonial[] = [
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
 * Verifica si la API de Payload está disponible
 */
export async function checkPayloadAPI(): Promise<boolean> {
  try {
    const url = import.meta.env.VITE_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';
    const response = await fetch(`${url}/api/health`, { 
      method: 'GET',
      mode: 'cors',
      signal: AbortSignal.timeout(2000) // 2 segundos de timeout
    });
    return response.ok;
  } catch (error) {
    console.log('Payload API no disponible, usando Mock Data:', error);
    return false;
  }
}

/**
 * Obtiene datos de servicios (con fallback a Mock Data)
 */
export async function getServicesData(): Promise<Service[]> {
  const isAvailable = await checkPayloadAPI();
  
  if (isAvailable) {
    try {
      const api = await import('./payloadAPI');
      const response = await api.default.get('/services');
      return response.data.docs || response.data;
    } catch (error) {
      console.warn('Error fetching from API, falling back to mock data:', error);
      return mockServices;
    }
  }
  
  return mockServices;
}

/**
 * Obtiene datos de proyectos (con fallback a Mock Data)
 */
export async function getProjectsData(): Promise<Project[]> {
  const isAvailable = await checkPayloadAPI();
  
  if (isAvailable) {
    try {
      const api = await import('./payloadAPI');
      const response = await api.default.get('/projects');
      return response.data.docs || response.data;
    } catch (error) {
      console.warn('Error fetching from API, falling back to mock data:', error);
      return mockProjects;
    }
  }
  
  return mockProjects;
}

/**
 * Obtiene datos de testimonios (con fallback a Mock Data)
 */
export async function getTestimonialsData(): Promise<Testimonial[]> {
  const isAvailable = await checkPayloadAPI();
  
  if (isAvailable) {
    try {
      const api = await import('./payloadAPI');
      const response = await api.default.get('/testimonials');
      return response.data.docs || response.data;
    } catch (error) {
      console.warn('Error fetching from API, falling back to mock data:', error);
      return mockTestimonials;
    }
  }
  
  return mockTestimonials;
}

/**
 * Función directa para obtener servicios (usada por payloadData.ts)
 */
export async function fetchServicesMock(): Promise<Service[]> {
  try {
    const api = await import('./payloadAPI');
    const response = await api.default.get('/services');
    return response.data.docs || response.data;
  } catch (error: any) {
    if (error.message === 'API_NOT_AVAILABLE' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log('✅ Payload API no disponible - Usando Mock Data para servicios');
      return mockServices;
    }
    console.warn('⚠️ Error en API de servicios, usando Mock Data:', error);
    return mockServices;
  }
}

/**
 * Función directa para obtener proyectos (usada por payloadData.ts)
 */
export async function fetchProjectsMock(): Promise<Project[]> {
  try {
    const api = await import('./payloadAPI');
    const response = await api.default.get('/projects');
    return response.data.docs || response.data;
  } catch (error: any) {
    if (error.message === 'API_NOT_AVAILABLE' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log('✅ Payload API no disponible - Usando Mock Data para proyectos');
      return mockProjects;
    }
    console.warn('⚠️ Error en API de proyectos, usando Mock Data:', error);
    return mockProjects;
  }
}

/**
 * Función directa para obtener testimonios (usada por payloadData.ts)
 */
export async function fetchTestimonialsMock(): Promise<Testimonial[]> {
  try {
    const api = await import('./payloadAPI');
    const response = await api.default.get('/testimonials');
    return response.data.docs || response.data;
  } catch (error: any) {
    if (error.message === 'API_NOT_AVAILABLE' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log('✅ Payload API no disponible - Usando Mock Data para testimonios');
      return mockTestimonials;
    }
    console.warn('⚠️ Error en API de testimonios, usando Mock Data:', error);
    return mockTestimonials;
  }
}

/**
 * Función directa para buscar servicio por ID
 */
export async function fetchServiceByIdMock(id: string): Promise<Service | null> {
  try {
    const api = await import('./payloadAPI');
    const response = await api.default.get(`/services/${id}`);
    return response.data.doc || response.data;
  } catch (error: any) {
    if (error.message === 'API_NOT_AVAILABLE' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log(`✅ Payload API no disponible - Buscando servicio ${id} en Mock Data`);
      return mockServices.find(s => s.id === id) || null;
    }
    console.warn(`⚠️ Error buscando servicio ${id}, usando Mock Data:`, error);
    return mockServices.find(s => s.id === id) || null;
  }
}

/**
 * Función directa para buscar proyecto por ID
 */
export async function fetchProjectByIdMock(id: string): Promise<Project | null> {
  try {
    const api = await import('./payloadAPI');
    const response = await api.default.get(`/projects/${id}`);
    return response.data.doc || response.data;
  } catch (error: any) {
    if (error.message === 'API_NOT_AVAILABLE' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log(`✅ Payload API no disponible - Buscando proyecto ${id} en Mock Data`);
      return mockProjects.find(p => p.id === id) || null;
    }
    console.warn(`⚠️ Error buscando proyecto ${id}, usando Mock Data:`, error);
    return mockProjects.find(p => p.id === id) || null;
  }
}