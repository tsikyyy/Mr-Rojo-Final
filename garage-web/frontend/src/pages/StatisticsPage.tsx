import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Wrench,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/services/api';
import type { Intervention, Voiture, TypeReparation } from '../types';

interface Stats {
  totalInterventions: number;
  totalAmount: number;
  totalClients: number;
  byStatus: {
    en_attente: number;
    en_reparation: number;
    terminee: number;
    payee: number;
  };
  avgDuration: number;
}

export default function StatisticsPage(): React.ReactElement {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalInterventions: 0,
    totalAmount: 0,
    totalClients: 0,
    byStatus: { en_attente: 0, en_reparation: 0, terminee: 0, payee: 0 },
    avgDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [interventionsRes, voituresRes, typesRes] = await Promise.all([
        apiClient.get('/interventions'),
        apiClient.get('/voitures'),
        apiClient.get('/types-reparation'),
      ]);

      const interventions: Intervention[] = Array.isArray(interventionsRes.data) ? interventionsRes.data : interventionsRes.data?.data || [];
      const voitures: Voiture[] = Array.isArray(voituresRes.data) ? voituresRes.data : voituresRes.data?.data || [];
      const types: TypeReparation[] = Array.isArray(typesRes.data) ? typesRes.data : typesRes.data?.data || [];

      // Calcul des statistiques
      const totalInterventions = interventions.length;
      const totalAmount = interventions.reduce((sum, i) => {
        const type = types.find((t) => t.id === i.type_reparation_id);
        return sum + (type?.prix || 0);
      }, 0);

      const uniqueClients = new Set(voitures.map((v) => v.utilisateur_id)).size;

      const byStatus = {
        en_attente: interventions.filter((i) => i.statut === 'en_attente').length,
        en_reparation: interventions.filter((i) => i.statut === 'en_reparation').length,
        terminee: interventions.filter((i) => i.statut === 'terminee').length,
        payee: interventions.filter((i) => i.statut === 'payee').length,
      };

      // Calcul de la durée moyenne
      const durations = types.map((t) => t.duree_secondes).filter((d) => d > 0);
      const avgDuration =
        durations.length > 0 ? Math.floor(durations.reduce((a, b) => a + b, 0) / durations.length / 60) : 0;

      setStats({
        totalInterventions,
        totalAmount,
        totalClients: uniqueClients,
        byStatus,
        avgDuration,
      });
      setError('');
    } catch (err: any) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusPercentages = {
    attente: stats.totalInterventions > 0 
      ? Math.round((stats.byStatus.en_attente / stats.totalInterventions) * 100)
      : 0,
    en_reparation: stats.totalInterventions > 0
      ? Math.round((stats.byStatus.en_reparation / stats.totalInterventions) * 100)
      : 0,
    terminee: stats.totalInterventions > 0
      ? Math.round((stats.byStatus.terminee / stats.totalInterventions) * 100)
      : 0,
    payee: stats.totalInterventions > 0
      ? Math.round((stats.byStatus.payee / stats.totalInterventions) * 100)
      : 0,
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
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <BarChart3 size={28} /> Statistiques
            </h1>
          </div>
          <button
            onClick={fetchStatistics}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            🔄 Rafraîchir
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Chargement des statistiques...
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Interventions */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total des interventions</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {stats.totalInterventions}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Wrench size={28} className="text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Montant total</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {(stats.totalAmount / 1000000).toLocaleString('fr-MG', {
                        maximumFractionDigits: 1,
                      })}
                      M Ar
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign size={28} className="text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Clients */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total des clients</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {stats.totalClients}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users size={28} className="text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Average Duration */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Durée moyenne</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      {stats.avgDuration} min
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock size={28} className="text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Cards */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp size={24} /> Distribution par statut
                </h2>

                {/* En Attente */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={20} className="text-orange-500" />
                      <span className="font-semibold text-gray-700">En attente</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      {stats.byStatus.en_attente}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${statusPercentages.attente}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{statusPercentages.attente}%</p>
                </div>

                {/* En Réparation */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-blue-500" />
                      <span className="font-semibold text-gray-700">En réparation</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.byStatus.en_reparation}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${statusPercentages.en_reparation}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{statusPercentages.en_reparation}%</p>
                </div>

                {/* Terminée */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-500" />
                      <span className="font-semibold text-gray-700">Terminée</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.byStatus.terminee}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${statusPercentages.terminee}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{statusPercentages.terminee}%</p>
                </div>

                {/* Payée */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-purple-500" />
                      <span className="font-semibold text-gray-700">Payée</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {stats.byStatus.payee}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${statusPercentages.payee}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{statusPercentages.payee}%</p>
                </div>
              </div>

              {/* Pie Chart Style Visual */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition</h3>
                <div className="flex flex-col items-center justify-center py-8">
                  {/* Circular Progress */}
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      {/* En attente arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="10"
                        strokeDasharray={`${(statusPercentages.attente / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">
                          {statusPercentages.terminee}%
                        </p>
                        <p className="text-xs text-gray-500">Terminées</p>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-8 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-gray-700">
                        En attente: {stats.byStatus.en_attente}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-700">
                        En cours: {stats.byStatus.en_reparation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700">
                        Terminée: {stats.byStatus.terminee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Résumé général</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Taux de complétion</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalInterventions > 0
                      ? Math.round((stats.byStatus.terminee / stats.totalInterventions) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.byStatus.en_attente}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">En cours de traitement</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.byStatus.en_reparation}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Montant moyen/intervention</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalInterventions > 0
                      ? (stats.totalAmount / stats.totalInterventions).toLocaleString('fr-MG', {
                          maximumFractionDigits: 0,
                        })
                      : 0}{' '}
                    Ar
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
