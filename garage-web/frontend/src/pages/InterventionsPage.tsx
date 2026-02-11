import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import { apiClient } from '../services/api';
import type { Intervention, Voiture, TypeReparation } from '../types';

interface InterventionDetail extends Intervention {
  voiture?: Voiture;
  type_reparation?: TypeReparation;
  montant?: number;
}

interface FormState {
  voiture_id: string;
  type_reparation_id: string;
  statut: 'en_attente' | 'en_reparation' | 'terminee' | 'payee'; // Aligned with backend
  date_debut?: string;
  date_fin?: string;
}

const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'en_attente':
      return 'bg-orange-100 text-orange-800 border border-orange-300';
    case 'en_reparation':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'terminee':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'payee':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case 'en_attente':
      return 'En attente';
    case 'en_reparation':
      return 'En réparation';
    case 'terminee':
      return 'Terminée';
    case 'payee':
      return 'Payée';
    default:
      return statut;
  }
};

export default function InterventionsPage(): React.ReactElement {
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState<InterventionDetail[]>([]);
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [typesReparation, setTypesReparation] = useState<TypeReparation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormState>({
    voiture_id: '',
    type_reparation_id: '',
    statut: 'en_attente',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interventionsRes, voituresRes, typesRes] = await Promise.all([
        apiClient.get('/interventions'),
        apiClient.get('/voitures'),
        apiClient.get('/types-reparation'),
      ]);

      const interventionsData = Array.isArray(interventionsRes.data) ? interventionsRes.data : interventionsRes.data?.data || [];
      const voituresData = Array.isArray(voituresRes.data) ? voituresRes.data : voituresRes.data?.data || [];
      const typesData = Array.isArray(typesRes.data) ? typesRes.data : typesRes.data?.data || [];

      setInterventions(
        interventionsData.map((intervention: any) => ({
          ...intervention,
          voiture: voituresData.find((v: any) => v.id === intervention.voiture_id),
          type_reparation: typesData.find((t: any) => t.id === intervention.type_reparation_id),
          montant: typesData.find((t: any) => t.id === intervention.type_reparation_id)?.prix || 0,
        }))
      );
      setVoitures(voituresData);
      setTypesReparation(typesData);
      setError('');
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      voiture_id: '',
      type_reparation_id: '',
      statut: 'en_attente',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Format dates for backend (YYYY-MM-DD HH:mm:ss)
    const payload = { ...formData };
    if (payload.date_debut && payload.date_debut.includes('T')) {
      payload.date_debut = payload.date_debut.replace('T', ' ');
      // Add seconds if missing
      if (payload.date_debut.length === 16) payload.date_debut += ':00';
    }
    if (payload.date_fin && payload.date_fin.includes('T')) {
      payload.date_fin = payload.date_fin.replace('T', ' ');
      // Add seconds if missing
      if (payload.date_fin.length === 16) payload.date_fin += ':00';
    }

    try {
      if (editingId) {
        await apiClient.put(`/interventions/${editingId}`, payload);
        setSuccess('Intervention mise à jour avec succès');
      } else {
        await apiClient.post('/interventions', payload);
        setSuccess('Intervention créée avec succès');
      }
      await fetchData();
      resetForm();
    } catch (err: any) {
      if (err.response && err.response.status === 422 && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Erreur de validation: ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      }
    }
  };

  const handleEdit = (intervention: InterventionDetail) => {
    setFormData({
      voiture_id: intervention.voiture_id,
      type_reparation_id: intervention.type_reparation_id,
      statut: intervention.statut,
      date_debut: intervention.date_debut,
      date_fin: intervention.date_fin,
    });
    setEditingId(intervention.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention?')) return;

    try {
      await apiClient.delete(`/interventions/${id}`);
      setSuccess('Intervention supprimée avec succès');
      await fetchData();
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Retour
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Gestion des Interventions</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={20} /> Nouvelle intervention
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
            {success}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Modifier intervention' : 'Nouvelle intervention'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Véhicule
                  </label>
                  <select
                    value={formData.voiture_id}
                    onChange={(e) =>
                      setFormData({ ...formData, voiture_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un véhicule</option>
                    {voitures.map((voiture) => (
                      <option key={voiture.id} value={voiture.id}>
                        {voiture.marque} {voiture.modele} ({voiture.immatriculation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de réparation
                  </label>
                  <select
                    value={formData.type_reparation_id}
                    onChange={(e) =>
                      setFormData({ ...formData, type_reparation_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    {typesReparation.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nom} ({type.prix} Ar)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statut: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_reparation">En réparation</option>
                    <option value="terminee">Terminée</option>
                    <option value="payee">Payée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date_debut || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, date_debut: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date_fin || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, date_fin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    <Check size={18} /> {editingId ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Chargement...</div>
          ) : interventions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Aucune intervention</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Type de réparation
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date de début
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {interventions.map((intervention) => (
                  <tr
                    key={intervention.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #{intervention.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {intervention.voiture
                        ? `${intervention.voiture.marque} ${intervention.voiture.modele}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {intervention.type_reparation?.nom || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {intervention.montant?.toLocaleString('fr-MG')} Ar
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatutColor(
                          intervention.statut
                        )}`}
                      >
                        {getStatutLabel(intervention.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {intervention.date_debut
                        ? new Date(intervention.date_debut).toLocaleDateString('fr-MG')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(intervention)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(intervention.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
