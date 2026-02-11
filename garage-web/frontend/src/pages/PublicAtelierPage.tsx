import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import type { Intervention, Voiture, TypeReparation } from '../types';

interface InterventionWithDetails extends Intervention {
  voiture?: Voiture;
  typeReparation?: TypeReparation;
  type_reparation?: TypeReparation;
  statut: 'en_attente' | 'en_reparation' | 'terminee' | 'payee';
}

export function PublicAtelierPage() {
  const [interventions, setInterventions] = useState<InterventionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/interventions');
      // Wrapper handling { success: true, data: [...] }
      const dataRaw = response.data;
      const data = Array.isArray(dataRaw) ? dataRaw : (dataRaw as any).data || [];
      
      // Filter for active repairs (en_reparation or en_attente)
      const activeInterventions = (data as any[]).filter(i => 
        i.statut === 'en_reparation' || i.statut === 'en_attente'
      );

      setInterventions(activeInterventions);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement public:', err);
      setError('Impossible de charger les données de l\'atelier.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_reparation':
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">En cours</span>;
      case 'en_attente':
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">En attente</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-blue-600 mr-2">🔧</span> Atelier en Direct
          </h1>
          <a href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Accès Staff
          </a>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {interventions.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                  Aucun véhicule n'est actuellement en cours de traitement dans notre atelier.
                </div>
              ) : (
                interventions.map((intervention) => {
                  // Handle both casing possibilities for the relation
                  const reparationName = intervention.type_reparation?.nom || intervention.typeReparation?.nom || 'Réparation générale';
                  
                  return (
                    <div key={intervention.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 border-l-4 border-blue-500">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          {getStatusBadge(intervention.statut)}
                          <span className="text-xs text-gray-400">#{intervention.id}</span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {intervention.voiture?.marque} {intervention.voiture?.modele}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                          {intervention.voiture?.immatriculation}
                        </p>
                        
                        <div className="border-t border-gray-100 pt-4 mt-2">
                          <p className="text-sm text-gray-600 mb-1">Intervention :</p>
                          <p className="text-md font-semibold text-gray-800">
                            {reparationName}
                          </p>
                        </div>
                        
                        {intervention.statut === 'en_reparation' && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                              </div>
                              <p className="text-xs text-right text-gray-500 mt-1">En cours de traitement</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
