import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { apiService } from '../services/api';

interface RepairHistory {
  id: string;
  brand: string;
  model: string;
  plate: string;
  problem: string;
  status: 'en_attente' | 'en_cours' | 'termine' | 'payee';
  estimatedPrice: number;
  createdAt: string;
  completedAt?: string;
  paidAt?: string;
  repairType: string;
  duration: number;
}

const RepairHistoryScreen = ({ onBack }: { onBack: () => void }) => {
  const [repairs, setRepairs] = useState<RepairHistory[]>([]);
  const [filter, setFilter] = useState<'all' | 'en_attente' | 'en_cours' | 'termine' | 'payee'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRepairHistory();
  }, []);

  const loadRepairHistory = async () => {
    try {
      // Simuler des données historiques complètes
      const mockHistory: RepairHistory[] = [
        {
          id: '1',
          brand: 'Renault',
          model: 'Clio',
          plate: 'ABC 123',
          problem: 'Vidange moteur: Huile moteur noire et filtre encrassé',
          status: 'payee',
          estimatedPrice: 45000,
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T14:30:00Z',
          paidAt: '2024-01-15T16:00:00Z',
          repairType: 'Vidange moteur',
          duration: 14400 // 4 heures
        },
        {
          id: '2',
          brand: 'Toyota',
          model: 'Yaris',
          plate: 'XYZ 789',
          problem: 'Réparation freinage: Plaquettes de frein avant usées',
          status: 'en_cours',
          estimatedPrice: 85000,
          createdAt: '2024-01-20T09:00:00Z',
          repairType: 'Réparation freinage',
          duration: 7200 // 2 heures
        },
        {
          id: '3',
          brand: 'Peugeot',
          model: '308',
          plate: 'DEF 456',
          problem: 'Changement pneus: Usure irrégulière des 4 pneus',
          status: 'termine',
          estimatedPrice: 95000,
          createdAt: '2024-01-18T14:00:00Z',
          completedAt: '2024-01-18T17:00:00Z',
          repairType: 'Changement pneus',
          duration: 10800 // 3 heures
        },
        {
          id: '4',
          brand: 'Citroën',
          model: 'C3',
          plate: 'GHI 789',
          problem: 'Diagnostic moteur: Voyant moteur allumé, perte de puissance',
          status: 'en_attente',
          estimatedPrice: 35000,
          createdAt: '2024-01-22T11:15:00Z',
          repairType: 'Diagnostic moteur',
          duration: 1800 // 30 minutes
        },
        {
          id: '5',
          brand: 'Ford',
          model: 'Focus',
          plate: 'JKL 012',
          problem: 'Climatisation: Système qui ne refroidit plus',
          status: 'payee',
          estimatedPrice: 65000,
          createdAt: '2024-01-10T08:30:00Z',
          completedAt: '2024-01-10T12:30:00Z',
          paidAt: '2024-01-10T15:00:00Z',
          repairType: 'Climatisation',
          duration: 14400 // 4 heures
        },
        {
          id: '6',
          brand: 'Volkswagen',
          model: 'Golf',
          plate: 'MNO 345',
          problem: 'Suspension: Amortisseurs arrière usés',
          status: 'termine',
          estimatedPrice: 120000,
          createdAt: '2024-01-12T09:00:00Z',
          completedAt: '2024-01-12T16:00:00Z',
          repairType: 'Suspension',
          duration: 25200 // 7 heures
        },
        {
          id: '7',
          brand: 'BMW',
          model: 'Série 3',
          plate: 'PQR 678',
          problem: 'Batterie: Démarrage difficile, batterie faible',
          status: 'payee',
          estimatedPrice: 28000,
          createdAt: '2024-01-08T13:00:00Z',
          completedAt: '2024-01-08T14:30:00Z',
          paidAt: '2024-01-08T16:00:00Z',
          repairType: 'Batterie',
          duration: 5400 // 1.5 heures
        },
        {
          id: '8',
          brand: 'Mercedes',
          model: 'Classe A',
          plate: 'STU 901',
          problem: 'Échappement: Bruit anormal, pot d\'échappement détérioré',
          status: 'en_cours',
          estimatedPrice: 75000,
          createdAt: '2024-01-21T10:00:00Z',
          repairType: 'Échappement',
          duration: 7200 // 2 heures
        }
      ];

      setRepairs(mockHistory);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'historique des réparations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return '#f59e0b';
      case 'en_cours': return '#3b82f6';
      case 'termine': return '#10b981';
      case 'payee': return '#6366f1';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'payee': return 'Payé';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes > 0 ? minutes + 'min' : ''}`;
  };

  const filteredRepairs = filter === 'all' 
    ? repairs 
    : repairs.filter(repair => repair.status === filter);

  const totalCost = repairs.reduce((sum, repair) => sum + repair.estimatedPrice, 0);
  const paidCost = repairs.filter(r => r.status === 'payee').reduce((sum, repair) => sum + repair.estimatedPrice, 0);
  const pendingCost = repairs.filter(r => r.status !== 'payee').reduce((sum, repair) => sum + repair.estimatedPrice, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de l'historique...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historique des Réparations</Text>
      </View>

      <View style={styles.content}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{repairs.length}</Text>
            <Text style={styles.statLabel}>Total Réparations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCost.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Coût Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{paidCost.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Déjà Payé</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingCost.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>En Attente</Text>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'en_attente', 'en_cours', 'termine', 'payee'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && styles.filterButtonActive
                ]}
                onPress={() => setFilter(status as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === status && styles.filterButtonTextActive
                ]}>
                  {status === 'all' ? 'Tous' : getStatusText(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des réparations */}
        {filteredRepairs.map((repair) => (
          <View key={repair.id} style={styles.repairCard}>
            <View style={styles.repairHeader}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleText}>{repair.brand} {repair.model}</Text>
                <Text style={styles.plateText}>{repair.plate}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(repair.status) }]}>
                <Text style={styles.statusText}>{getStatusText(repair.status)}</Text>
              </View>
            </View>

            <View style={styles.repairDetails}>
              <Text style={styles.repairType}>{repair.repairType}</Text>
              <Text style={styles.problemText}>{repair.problem}</Text>
              
              <View style={styles.repairMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Prix:</Text>
                  <Text style={styles.metaValue}>{repair.estimatedPrice.toLocaleString()} Ar</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Durée:</Text>
                  <Text style={styles.metaValue}>{formatDuration(repair.duration)}</Text>
                </View>
              </View>

              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <Text style={styles.timelineLabel}>Création:</Text>
                  <Text style={styles.timelineDate}>{formatDate(repair.createdAt)}</Text>
                </View>
                {repair.completedAt && (
                  <View style={styles.timelineItem}>
                    <Text style={styles.timelineLabel}>Terminé:</Text>
                    <Text style={styles.timelineDate}>{formatDate(repair.completedAt)}</Text>
                  </View>
                )}
                {repair.paidAt && (
                  <View style={styles.timelineItem}>
                    <Text style={styles.timelineLabel}>Payé:</Text>
                    <Text style={styles.timelineDate}>{formatDate(repair.paidAt)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1e40af',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  repairCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  repairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  plateText: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  repairDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  repairType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  problemText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 15,
  },
  repairMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  timeline: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  timelineDate: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '500',
  },
});

export default RepairHistoryScreen;
