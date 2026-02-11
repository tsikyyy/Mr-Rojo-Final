export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Voiture {
  id: string;
  utilisateur_id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  description_panne: string;
  statut: 'en_attente' | 'en_reparation' | 'terminee' | 'payee'; // Aligned with backend/mobile
  created_at?: string;
  updated_at?: string;
}

export interface TypeReparation {
  id: string;
  nom: string;
  prix: number;
  duree_secondes: number;
  created_at?: string;
  updated_at?: string;
}

export interface Intervention {
  id: string;
  voiture_id: string;
  type_reparation_id: string;
  statut: 'en_attente' | 'en_reparation' | 'terminee' | 'payee'; // Aligned with backend/mobile
  date_debut?: string;
  date_fin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Statistics {
  total_interventions: number;
  montant_total: number;
  nombre_clients: number;
  interventions_par_status: {
    en_attente: number;
    en_reparation: number;
    terminee: number;
  };
}
