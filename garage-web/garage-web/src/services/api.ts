// API Service pour la connexion à la base de données Laravel
const API_BASE_URL = 'http://localhost:8000/api'; // URL de ton backend Laravel
import { Voiture, TypeReparation, Intervention, Utilisateur } from '../types/Voiture';

export const apiService = {
  // Authentification
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur login:', error);
      // Retourner une simulation si l'API n'est pas disponible
      const validUsers = [
        { email: 'admin@garage.com', password: 'admin123', name: 'Admin Garage' },
        { email: 'user@demo.com', password: 'demo123', name: 'Utilisateur Demo' },
        { email: 'jean@dupont.com', password: 'jean123', name: 'Jean Dupont' },
        { email: 'marie@martin.com', password: 'marie123', name: 'Marie Martin' }
      ];
      const user = validUsers.find(u => u.email === email && u.password === password);
      if (user) {
        return { success: true, user };
      }
      throw error;
    }
  },

  // Récupérer toutes les voitures (mapper vers le format mobile)
  async getCars() {
    try {
      const response = await fetch(`${API_BASE_URL}/voitures`);
      const voitures: Voiture[] = await response.json();
      
      // Mapper vers le format mobile avec prix réel depuis la base
      return voitures.map(voiture => ({
        id: voiture.id.toString(),
        brand: voiture.marque,
        model: voiture.modele,
        plate: voiture.immatriculation,
        problem: voiture.description_panne,
        status: voiture.statut === 'en_attente' ? 'en_attente' :
                voiture.statut === 'en_reparation' ? 'en_cours' :
                voiture.statut === 'terminee' ? 'termine' : 'paye',
        estimatedPrice: voiture.estimated_price || this.getEstimatedPrice(voiture.description_panne)
      }));
    } catch (error) {
      console.error('Erreur getCars:', error);
      // Retourner des données simulées si l'API n'est pas disponible (selon base.sql)
      return [
        {
          id: '1',
          brand: 'Renault',
          model: 'Clio',
          plate: 'ABC 123',
          problem: 'Vidange d\'huile moteur',
          status: 'en_attente',
          estimatedPrice: 30000
        },
        {
          id: '2',
          brand: 'Toyota',
          model: 'Yaris',
          plate: 'XYZ 789',
          problem: 'Réparation du système de freinage',
          status: 'en_cours',
          estimatedPrice: 50000
        },
        {
          id: '3',
          brand: 'Peugeot',
          model: '308',
          plate: 'DEF 456',
          problem: 'Changement des pneus',
          status: 'termine',
          estimatedPrice: 40000
        }
      ];
    }
  },

  // Helper pour estimer le prix basé sur la description (selon base.sql)
  getEstimatedPrice(description: string): number {
    if (description.toLowerCase().includes('frein')) return 50000;
    if (description.toLowerCase().includes('vidange')) return 30000;
    if (description.toLowerCase().includes('filtre')) return 20000;
    if (description.toLowerCase().includes('batterie')) return 25000;
    if (description.toLowerCase().includes('amortisseur')) return 80000;
    if (description.toLowerCase().includes('embrayage')) return 120000;
    if (description.toLowerCase().includes('pneu')) return 40000;
    if (description.toLowerCase().includes('refroidissement')) return 60000;
    return 30000; // Prix par défaut (Vidange)
  },

  // Ajouter une nouvelle voiture/réparation
  async addCar(carData: any) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/voitures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          marque: carData.brand,
          modele: carData.model,
          immatriculation: carData.plate,
          description_panne: carData.problem,
          statut: 'en_attente'
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const voiture: Voiture = await response.json();
      
      // Mapper vers le format mobile
      return {
        id: voiture.id.toString(),
        brand: voiture.marque,
        model: voiture.modele,
        plate: voiture.immatriculation,
        problem: voiture.description_panne,
        status: 'en_attente',
        estimatedPrice: this.getEstimatedPrice(voiture.description_panne)
      };
    } catch (error) {
      console.log('API non disponible, création de voiture simulée');
      // Retourner une simulation si l'API n'est pas disponible
      const newCar = {
        id: Date.now().toString(),
        brand: carData.brand || carData.marque,
        model: carData.model || carData.modele,
        plate: carData.plate || carData.immatriculation,
        problem: carData.problem || carData.description_panne,
        status: 'en_attente',
        estimatedPrice: this.getEstimatedPrice(carData.problem || carData.description_panne)
      };
      return newCar;
    }
  },

  // Mettre à jour le statut d'une voiture
  async updateCarStatus(carId: string, status: string) {
    try {
      // Mapper le statut mobile vers le statut backend
      const backendStatus = status === 'en_attente' ? 'en_attente' :
                           status === 'en_cours' ? 'en_reparation' :
                           status === 'termine' ? 'terminee' : 'payee';
      
      const response = await fetch(`${API_BASE_URL}/voitures/${carId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: backendStatus }),
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur updateCarStatus:', error);
      // Retourner une simulation si l'API n'est pas disponible
      return { id: carId, status };
    }
  },

  // Récupérer les types de réparations
  async getRepairTypes() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/types-reparation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const types: TypeReparation[] = await response.json();
      
      // Mapper vers le format mobile
      return types.map(type => ({
        id: type.id.toString(),
        nom: type.nom,
        prix: type.prix,
        duree_secondes: type.duree_secondes
      }));
    } catch (error) {
      console.log('API non disponible, utilisation des types par défaut');
      // Retourner les types par défaut si l'API n'est pas disponible
      return [
        { id: '1', nom: 'Frein', prix: 50000, duree_secondes: 1800 },
        { id: '2', nom: 'Vidange', prix: 30000, duree_secondes: 1200 },
        { id: '3', nom: 'Filtre', prix: 20000, duree_secondes: 900 },
        { id: '4', nom: 'Batterie', prix: 25000, duree_secondes: 600 },
        { id: '5', nom: 'Amortisseurs', prix: 80000, duree_secondes: 3600 },
        { id: '6', nom: 'Embrayage', prix: 120000, duree_secondes: 5400 },
        { id: '7', nom: 'Pneus', prix: 40000, duree_secondes: 2400 },
        { id: '8', nom: 'Système de refroidissement', prix: 60000, duree_secondes: 3000 }
      ];
    }
  }
};
