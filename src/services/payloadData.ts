import api from './payloadAPI';
import { 
  fetchServicesMock,
  fetchProjectsMock,
  fetchTestimonialsMock,
  fetchServiceByIdMock,
  fetchProjectByIdMock,
  checkPayloadAPI,
  mockServices,
  mockProjects,
  mockTestimonials 
} from './mockData';

// Types for Payload CMS data
export interface Service {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  features: Array<{
    text: string;
    image: string;
  }>;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  heroImage: string;
  description: string;
  specs: {
    client: string;
    location: string;
    year: string;
    area: string;
  };
  galleryImages: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  image: string;
}

// Service API functions
export const fetchServices = async (): Promise<Service[]> => {
  return await fetchServicesMock();
};

export const fetchServiceById = async (id: string): Promise<Service | null> => {
  return await fetchServiceByIdMock(id);
};

// Project API functions
export const fetchProjects = async (): Promise<Project[]> => {
  return await fetchProjectsMock();
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  return await fetchProjectByIdMock(id);
};

// Testimonial API functions
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  return await fetchTestimonialsMock();
};

// General utility functions
export const isPayloadDataAvailable = (): boolean => {
  // Siempre retornamos true para evitar bloqueos, pero verificamos si hay datos disponibles
  return true;
};

export const getPayloadErrorMessage = (error: any): string => {
  if (error.response) {
    return `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
  } else if (error.request) {
    return 'Network Error: Unable to connect to Payload CMS - Using Mock Data';
  } else {
    return `Request Error: ${error.message}`;
  }
};

// Nueva función para verificar disponibilidad real
export const isAPIAvailable = async (): Promise<boolean> => {
  return await checkPayloadAPI();
};
