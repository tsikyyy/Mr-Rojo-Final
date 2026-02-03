import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

interface Car {
  id: string;
  brand: string;
  model: string;
  plate: string;
  problem: string;
  status: 'en_attente' | 'en_cours' | 'termine';
  estimatedPrice: number;
}

const CarListScreen = ({ onAddCar, onCarDetail, onLogout, cars }: { 
  onAddCar: () => void; 
  onCarDetail: (car: Car) => void;
  onLogout: () => void;
  cars: Car[];
}) => {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return '#f59e0b';
      case 'en_cours': return '#3b82f6';
      case 'termine': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      default: return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Voitures</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cars.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cars.filter(c => c.status === 'termine').length}</Text>
            <Text style={styles.statLabel}>Terminées</Text>
          </View>
        </View>

        {cars.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aucune voiture enregistrée</Text>
            <Text style={styles.emptyText}>Ajoutez votre première voiture pour commencer</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={onAddCar}>
              <Text style={styles.emptyButtonText}>Ajouter une voiture</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.carList}>
            {cars.map((car) => (
              <TouchableOpacity
                key={car.id}
                style={styles.carItem}
                onPress={() => onCarDetail(car)}
              >
                <View style={styles.carHeader}>
                  <View style={styles.carInfo}>
                    <Text style={styles.carName}>{car.brand} {car.model}</Text>
                    <Text style={styles.carPlate}>{car.plate}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(car.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(car.status)}</Text>
                  </View>
                </View>
                <View style={styles.carDetails}>
                  <Text style={styles.carProblem}>{car.problem}</Text>
                  <Text style={styles.carPrice}>{car.estimatedPrice.toLocaleString()} Ar</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={onAddCar}>
          <Text style={styles.addButtonText}>+ Ajouter une voiture</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e40af',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
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
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  carList: {
    gap: 15,
  },
  carItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 3,
  },
  carPlate: {
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
  carDetails: {
    gap: 5,
  },
  carProblem: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CarListScreen;
