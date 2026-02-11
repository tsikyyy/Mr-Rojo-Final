import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/api';
import {
  BarChart3, LogOut, Menu, X, Wrench, Car, DollarSign,
  Calendar, TrendingUp, ArrowRight
} from 'lucide-react';

interface StatisticsData {
  totalRepairs: number;
  todayRepairs: number;
  totalAmount: number;
  carsWaiting: number;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<StatisticsData>({
    totalRepairs: 0,
    todayRepairs: 0,
    totalAmount: 0,
    carsWaiting: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      // Récupère les interventions pour calculer les stats
      const interventionsRes = await apiClient.get('/interventions');
      const voituresRes = await apiClient.get('/voitures');

      // Gérer les deux formats: axios wraps in .data, mais parfois direct
      const interventions = Array.isArray(interventionsRes.data) 
        ? interventionsRes.data 
        : interventionsRes.data?.data || [];
      const voitures = Array.isArray(voituresRes.data)
        ? voituresRes.data
        : voituresRes.data?.data || [];

      // Calcul des statistiques
      const today = new Date().toISOString().split('T')[0];
      const todayRepairs = interventions.filter((i: any) =>
        i.created_at?.startsWith(today)
      ).length;

      const waitingCars = voitures.filter((v: any) =>
        v.statut === 'en_attente'
      ).length;

      setStats({
        totalRepairs: interventions.length,
        todayRepairs: todayRepairs,
        totalAmount: interventions.reduce((sum: number, i: any) => sum + (i.montant || 0), 0),
        carsWaiting: waitingCars,
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/dashboard', active: true },
    { label: 'Interventions', icon: Wrench, path: '/interventions', active: false },
    { label: 'Véhicules', icon: Car, path: '/voitures', active: false },
    { label: 'Statistiques', icon: TrendingUp, path: '/statistics', active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="bg-white rounded-lg p-2">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg">Garage</span>}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-500 bg-opacity-40 border-l-4 border-white'
                  : 'hover:bg-blue-500 hover:bg-opacity-20'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="p-3 border-t border-blue-500 border-opacity-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-blue-500 hover:bg-opacity-20 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Bienvenue, {user?.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Chargement des données...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Réparations Totales */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Réparations Totales</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalRepairs}</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Wrench className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-4">Depuis le début</p>
                </div>

                {/* Réparations Aujourd'hui */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Aujourd'hui</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.todayRepairs}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-4">Réparations ce jour</p>
                </div>

                {/* Montant Total */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Montant Total</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {stats.totalAmount.toLocaleString()} Ar
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-4">Revenus générés</p>
                </div>

                {/* Voitures en Attente */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">En Attente</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.carsWaiting}</p>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3">
                      <Car className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-4">Voitures à traiter</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Card */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Actions Rapides
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/interventions')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
                    >
                      <span>Nouvelle intervention</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/voitures')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-700 font-medium"
                    >
                      <span>Ajouter véhicule</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/statistics')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-purple-700 font-medium"
                    >
                      <span>Voir statistiques</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    État du Système
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">API Backend</span>
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                        ✓ Actif
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Base de Données</span>
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                        ✓ Actif
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-700">Utilisateurs</span>
                      <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                        {user?.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Authentification</span>
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                        ✓ Sanctum JWT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Bienvenue dans Garage Premium! 🚗</h2>
                <p className="text-blue-100 mb-4">
                  Gérez efficacement vos réparations automobiles et suivez l'état de votre garage en temps réel.
                </p>
                <button
                  onClick={() => navigate('/interventions')}
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Démarrer →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
