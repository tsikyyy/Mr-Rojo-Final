export interface Voiture {
  id: number;
  utilisateur_id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  description_panne: string;
  statut: 'en_attente' | 'en_reparation' | 'terminee' | 'payee';
  created_at: string;
  updated_at: string;
  estimated_price?: number; // Prix calculé depuis le backend
}

export interface TypeReparation {
  id: number;
  nom: string;
  prix: number;
  duree_secondes: number;
  created_at: string;
  updated_at: string;
}

export interface Intervention {
  id: number;
  voiture_id: number;
  type_reparation_id: number;
  slot_id: number | null;
  statut: 'en_attente' | 'en_cours' | 'terminee';
  date_debut: string | null;
  date_fin: string | null;
  created_at: string;
  updated_at: string;
}

export interface Utilisateur {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}
