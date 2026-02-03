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

const NotificationScreen = ({ onBack, cars }: { 
  onBack: () => void;
  cars: Car[];
}) => {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  const carsReady = cars.filter(c => c.status === 'termine');
  const carsInProgress = cars.filter(c => c.status === 'en_cours');
  const carsWaiting = cars.filter(c => c.status === 'en_attente');

  const notificationTypes = [
    { 
      id: 'ready', 
      name: 'Réparations Terminées', 
      cars: carsReady,
      color: '#10b981',
      message: 'Votre réparation est terminée !'
    },
    { 
      id: 'progress', 
      name: 'Réparations en Cours', 
      cars: carsInProgress,
      color: '#3b82f6',
      message: 'Votre réparation est en cours...'
    },
    { 
      id: 'waiting', 
      name: 'En Attente de Diagnostic', 
      cars: carsWaiting,
      color: '#f59e0b',
      message: 'Votre véhicule est en attente de diagnostic.'
    }
  ];

  const toggleCarSelection = (carId: string) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const sendNotifications = () => {
    if (selectedCars.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un véhicule');
      return;
    }

    const selectedCarsInfo = cars.filter(car => selectedCars.includes(car.id));
    
    Alert.alert(
      'Notifications Envoyées',
      `${selectedCars.length} notifications ont été envoyées:\n\n` +
      selectedCarsInfo.map(car => 
        `${car.brand} ${car.model} (${car.plate})`
      ).join('\n'),
      [
        { text: 'OK', onPress: onBack }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Envoyer Notifications</Text>
      </View>

      <View style={styles.content}>
        {notificationTypes.map((type) => (
          <View key={type.id} style={styles.notificationSection}>
            <View style={[styles.sectionHeader, { backgroundColor: type.color }]}>
              <Text style={styles.sectionTitle}>{type.name}</Text>
              <Text style={styles.sectionCount}>{type.cars.length} véhicule(s)</Text>
            </View>

            {type.cars.length > 0 ? (
              type.cars.map((car) => (
                <TouchableOpacity
                  key={car.id}
                  style={[
                    styles.carItem,
                    selectedCars.includes(car.id) && styles.selectedCar
                  ]}
                  onPress={() => toggleCarSelection(car.id)}
                >
                  <View style={styles.carInfo}>
                    <Text style={styles.carName}>{car.brand} {car.model}</Text>
                    <Text style={styles.carDetails}>{car.plate} • {car.problem}</Text>
                    <Text style={styles.carPrice}>{car.estimatedPrice.toLocaleString()} Ar</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedCars.includes(car.id) && styles.checkboxSelected
                  ]}>
                    {selectedCars.includes(car.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucun véhicule dans cette catégorie</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.summarySection}>
          <Text style={styles.summaryText}>
            {selectedCars.length} véhicule(s) sélectionné(s)
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, selectedCars.length === 0 && styles.disabledButton]}
          onPress={sendNotifications}
          disabled={selectedCars.length === 0}
        >
          <Text style={styles.sendButtonText}>
            Envoyer {selectedCars.length} Notification(s)
          </Text>
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
  notificationSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  carItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCar: {
    backgroundColor: '#eff6ff',
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 3,
  },
  carDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 3,
  },
  carPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
