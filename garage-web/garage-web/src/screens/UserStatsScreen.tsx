import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { apiService } from '../services/api';

interface UserStats {
  totalRepairs: number;
  totalSpent: number;
  averageCost: number;
  lastRepairDate: string;
}

const UserStatsScreen = ({ onBack, userCars }: { 
  onBack: () => void;
  userCars: any[];
}) => {
  const [stats, setStats] = useState<UserStats>({
    totalRepairs: 0,
    totalSpent: 0,
    averageCost: 0,
    lastRepairDate: ''
  });

  useEffect(() => {
    calculateStats();
  }, [userCars]);

  const calculateStats = () => {
    const completedRepairs = userCars.filter(car => car.status === 'termine');
    const totalSpent = completedRepairs.reduce((sum, car) => sum + car.estimatedPrice, 0);
    const averageCost = completedRepairs.length > 0 ? totalSpent / completedRepairs.length : 0;
    const lastRepair = completedRepairs[completedRepairs.length - 1];

    setStats({
      totalRepairs: completedRepairs.length,
      totalSpent,
      averageCost,
      lastRepairDate: lastRepair ? new Date().toLocaleDateString() : 'Aucune'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mes Statistiques</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalRepairs}</Text>
            <Text style={styles.statLabel}>Réparations</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalSpent.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Total Dépensé</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.round(stats.averageCost).toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Coût Moyen</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.lastRepairDate}</Text>
            <Text style={styles.statLabel}>Dernière Réparation</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Répartition des Coûts</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>
            Budget mensuel utilisé: {Math.min(100, Math.round((stats.totalSpent / 500000) * 100))}%
          </Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Historique Récent</Text>
          {userCars.slice(-3).reverse().map((car, index) => (
            <View key={car.id} style={styles.historyItem}>
              <Text style={styles.historyCar}>{car.brand} {car.model}</Text>
              <Text style={styles.historyPrice}>{car.estimatedPrice.toLocaleString()} Ar</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: car.status === 'termine' ? '#10b981' : 
                               car.status === 'en_cours' ? '#3b82f6' : '#f59e0b' 
              }]}>
                <Text style={styles.statusText}>
                  {car.status === 'termine' ? 'Terminé' : 
                   car.status === 'en_cours' ? 'En cours' : 'En attente'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    width: '65%',
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  historyCar: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    flex: 1,
  },
  historyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default UserStatsScreen;
