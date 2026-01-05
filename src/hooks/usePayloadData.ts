import { useState, useEffect, useCallback } from 'react';
import { 
  fetchServices, 
  fetchProjects, 
  fetchServiceById, 
  fetchProjectById,
  isPayloadDataAvailable,
  getPayloadErrorMessage 
} from '../services/payloadData';

// Custom hook for fetching services data
export const useServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err: any) {
      const errorMessage = getPayloadErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadServiceById = useCallback(async (id: string) => {
    try {
      const service = await fetchServiceById(id);
      return service;
    } catch (err: any) {
      const errorMessage = getPayloadErrorMessage(err);
      setError(errorMessage);
      console.error(`Failed to load service ${id}:`, err);
      return null;
    }
  }, []);

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return {
    services,
    loading,
    error,
    refetch: loadServices,
    getServiceById: loadServiceById
  };
};

// Custom hook for fetching projects data
export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      const errorMessage = getPayloadErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjectById = useCallback(async (id: string) => {
    try {
      const project = await fetchProjectById(id);
      return project;
    } catch (err: any) {
      const errorMessage = getPayloadErrorMessage(err);
      setError(errorMessage);
      console.error(`Failed to load project ${id}:`, err);
      return null;
    }
  }, []);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    refetch: loadProjects,
    getProjectById: loadProjectById
  };
};
