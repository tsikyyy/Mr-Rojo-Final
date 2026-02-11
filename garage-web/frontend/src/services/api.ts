import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { LoginResponse, Voiture, Intervention, TypeReparation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiClient extends AxiosInstance {
  setAuthToken: (token: string | null) => void;
}

const createApiClient = (): ApiClient => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }) as ApiClient;

  // Ajouter le token à chaque requête
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fonction pour définir le token
  instance.setAuthToken = (token: string | null) => {
    if (token) {
      instance.defaults.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem('auth_token', token);
    } else {
      delete instance.defaults.headers.Authorization;
      localStorage.removeItem('auth_token');
    }
  };

  return instance;
};

const apiClient = createApiClient();

// ===== AUTHENTIFICATION =====
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, name: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  logout: () => {
    apiClient.setAuthToken(null);
  },

  setToken: (token: string) => {
    apiClient.setAuthToken(token);
  },
};

// ===== VOITURES =====
export const voitureService = {
  getAll: async (): Promise<Voiture[]> => {
    const response = await apiClient.get<Voiture[]>('/voitures');
    return response.data;
  },

  getById: async (id: string): Promise<Voiture> => {
    const response = await apiClient.get<Voiture>(`/voitures/${id}`);
    return response.data;
  },

  create: async (data: Partial<Voiture>): Promise<Voiture> => {
    const response = await apiClient.post<Voiture>('/voitures', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Voiture>): Promise<Voiture> => {
    const response = await apiClient.put<Voiture>(`/voitures/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/voitures/${id}`);
  },
};

// ===== INTERVENTIONS =====
export const interventionService = {
  getAll: async (): Promise<Intervention[]> => {
    const response = await apiClient.get<Intervention[]>('/interventions');
    return response.data;
  },

  getById: async (id: string): Promise<Intervention> => {
    const response = await apiClient.get<Intervention>(`/interventions/${id}`);
    return response.data;
  },

  create: async (data: Partial<Intervention>): Promise<Intervention> => {
    const response = await apiClient.post<Intervention>('/interventions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Intervention>): Promise<Intervention> => {
    const response = await apiClient.put<Intervention>(`/interventions/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, statut: string): Promise<Intervention> => {
    const response = await apiClient.patch<Intervention>(`/interventions/${id}/status`, { statut });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/interventions/${id}`);
  },
};

// ===== TYPES DE RÉPARATION =====
export const typeReparationService = {
  getAll: async (): Promise<TypeReparation[]> => {
    const response = await apiClient.get<TypeReparation[]>('/types-reparation');
    return response.data;
  },

  getById: async (id: string): Promise<TypeReparation> => {
    const response = await apiClient.get<TypeReparation>(`/types-reparation/${id}`);
    return response.data;
  },

  create: async (data: Partial<TypeReparation>): Promise<TypeReparation> => {
    const response = await apiClient.post<TypeReparation>('/types-reparation', data);
    return response.data;
  },

  update: async (id: string, data: Partial<TypeReparation>): Promise<TypeReparation> => {
    const response = await apiClient.put<TypeReparation>(`/types-reparation/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/types-reparation/${id}`);
  },
};

export { apiClient };
