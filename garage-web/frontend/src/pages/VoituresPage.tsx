import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import { apiClient } from '../services/api';
import type { Voiture } from '../types';

interface FormState {
  marque: string;
  modele: string;
  immatriculation: string;
  description_panne: string;
  utilisateur_id: string;
  statut: 'en_attente' | 'en_reparation' | 'terminee' | 'payee';
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

export default function VoituresPage(): React.ReactElement {
  const navigate = useNavigate();
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchStatut, setSearchStatut] = useState<string>('');
  const [formData, setFormData] = useState<FormState>({
    marque: '',
    modele: '',
    immatriculation: '',
    description_panne: '',
    utilisateur_id: '1',
    statut: 'en_attente',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/voitures');
      const voituresData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setVoitures(voituresData);
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
      marque: '',
      modele: '',
      immatriculation: '',
      description_panne: '',
      utilisateur_id: '1',
      statut: 'en_attente',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await apiClient.put(`/voitures/${editingId}`, formData);
        setSuccess('Voiture mise à jour avec succès');
      } else {
        await apiClient.post('/voitures', formData);
        setSuccess('Voiture ajoutée avec succès');
      }
      await fetchData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (voiture: Voiture) => {
    setFormData({
      marque: voiture.marque,
      modele: voiture.modele,
      immatriculation: voiture.immatriculation,
      description_panne: voiture.description_panne,
      utilisateur_id: voiture.utilisateur_id,
      statut: voiture.statut,
    });
    setEditingId(voiture.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture?')) return;

    try {
      await apiClient.delete(`/voitures/${id}`);
      setSuccess('Voiture supprimée avec succès');
      await fetchData();
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  const filteredVoitures =
    searchStatut === ''
      ? voitures
      : voitures.filter((v) => v.statut === searchStatut);

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
            <h1 className="text-2xl font-bold text-blue-600">Gestion des Voitures</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={20} /> Ajouter voiture
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

        <div className="mb-4 flex gap-2">
          <select
            value={searchStatut}
            onChange={(e) => setSearchStatut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminée</option>
          </select>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Modifier voiture' : 'Ajouter voiture'}
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
                    Marque
                  </label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) =>
                      setFormData({ ...formData, marque: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle
                  </label>
                  <input
                    type="text"
                    value={formData.modele}
                    onChange={(e) =>
                      setFormData({ ...formData, modele: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immatriculation
                  </label>
                  <input
                    type="text"
                    value={formData.immatriculation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        immatriculation: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="EX: 123 ABC"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description de la panne
                  </label>
                  <textarea
                    value={formData.description_panne}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_panne: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
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

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    <Check size={18} /> {editingId ? 'Modifier' : 'Ajouter'}
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
          ) : filteredVoitures.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Aucune voiture trouvée</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Immatriculation
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Description de panne
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Depuis
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVoitures.map((voiture) => (
                  <tr
                    key={voiture.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {voiture.immatriculation}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {voiture.marque} {voiture.modele}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {voiture.description_panne || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatutColor(
                          voiture.statut
                        )}`}
                      >
                        {getStatutLabel(voiture.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {voiture.created_at
                        ? new Date(voiture.created_at).toLocaleDateString('fr-MG')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(voiture)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(voiture.id)}
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
