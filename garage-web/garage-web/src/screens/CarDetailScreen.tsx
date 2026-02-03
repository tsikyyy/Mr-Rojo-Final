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

const CarDetailScreen = ({ car, onBack, onPayment }: { 
  car: Car;
  onBack: () => void;
  onPayment: () => void;
}) => {
  const [showTimeline, setShowTimeline] = useState(false);

  const simulateNotification = () => {
    Alert.alert(
      'Notification envoyée',
      `Notification envoyée pour ${car.brand} ${car.model}`,
      [{ text: 'OK' }]
    );
  };

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

  const timeline = [
    { date: '10/01/2026', time: '09:00', status: 'en_attente', description: 'Déclaration reçue' },
    { date: '10/01/2026', time: '10:30', status: 'en_attente', description: 'Diagnostic en cours' },
    { date: '10/01/2026', time: '14:00', status: 'en_cours', description: 'Réparation commencée' },
    { date: '11/01/2026', time: '16:00', status: 'termine', description: 'Réparation terminée' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Détails du Véhicule</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.carInfoCard}>
          <View style={styles.carHeader}>
            <Text style={styles.carName}>{car.brand} {car.model}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(car.status) }]}>
              <Text style={styles.statusText}>{getStatusText(car.status)}</Text>
            </View>
          </View>
          
          <View style={styles.carDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Immatriculation</Text>
              <Text style={styles.detailValue}>{car.plate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Problème</Text>
              <Text style={styles.detailValue}>{car.problem}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>Coût Estimé</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Main d'œuvre</Text>
            <Text style={styles.priceValue}>{Math.round(car.estimatedPrice * 0.6).toLocaleString()} Ar</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Pièces détachées</Text>
            <Text style={styles.priceValue}>{Math.round(car.estimatedPrice * 0.4).toLocaleString()} Ar</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total estimé</Text>
            <Text style={styles.totalValue}>{car.estimatedPrice.toLocaleString()} Ar</Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Text style={styles.cardTitle}>Historique</Text>
            <TouchableOpacity onPress={() => setShowTimeline(!showTimeline)}>
              <Text style={styles.toggleText}>{showTimeline ? 'Masquer' : 'Afficher'}</Text>
            </TouchableOpacity>
          </View>
          
          {showTimeline && (
            <View style={styles.timeline}>
              {timeline.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineDate}>
                      <Text style={styles.timelineDateText}>{item.date}</Text>
                      <Text style={styles.timelineTimeText}>{item.time}</Text>
                    </View>
                    <Text style={styles.timelineDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {car.status === 'termine' && (
          <TouchableOpacity style={styles.paymentButton} onPress={onPayment}>
            <Text style={styles.paymentButtonText}>Payer la réparation ({car.estimatedPrice.toLocaleString()} Ar)</Text>
          </TouchableOpacity>
        )}

        {car.status !== 'termine' && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {car.status === 'en_attente' ? 'En attente de diagnostic...' : 
               car.status === 'en_cours' ? 'Réparation en cours...' : ''}
            </Text>
            <Text style={styles.infoSubtext}>
              Le bouton de paiement apparaîtra lorsque la réparation sera terminée
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.notificationButton} onPress={simulateNotification}>
          <Text style={styles.notificationButtonText}>Envoyer une notification</Text>
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
  carInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 15,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
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
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#3b82f6',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  timeline: {
    gap: 15,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    marginTop: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  timelineDateText: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  timelineTimeText: {
    fontSize: 14,
    color: '#64748b',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  paymentButton: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 5,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  notificationButton: {
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
  notificationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CarDetailScreen;
