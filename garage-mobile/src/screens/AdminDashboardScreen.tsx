import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import RepairHistoryScreen from './RepairHistoryScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import ReportScreen from './ReportScreen';
import NotificationScreen from './NotificationScreen';
import SettingsScreen from './SettingsScreen';
import { Car } from '../types/Car';

const AdminDashboardScreen = ({ onBack, cars, onUpdateCar }: { 
  onBack: () => void;
  cars: Car[];
  onUpdateCar: (carId: string, status: Car['status']) => void;
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'notification' | 'settings' | 'repairHistory' | 'paymentHistory'>('dashboard');
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const stats = {
    total: cars.length,
    enAttente: cars.filter(c => c.status === 'en_attente').length,
    enCours: cars.filter(c => c.status === 'en_cours').length,
    termine: cars.filter(c => c.status === 'termine').length,
    paye: cars.filter(c => c.status === 'paye').length,
    revenuTotal: cars.filter(c => c.status === 'paye').reduce((sum, c) => sum + c.estimatedPrice, 0)
  };

  const recentCars = cars.slice(-5).reverse();

  const updateCarStatus = (carId: string, newStatus: Car['status']) => {
    Alert.alert(
      'Mettre à jour le statut',
      `Changer le statut de la réparation ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            onUpdateCar(carId, newStatus);
            Alert.alert('Succès', 'Statut mis à jour avec succès !');
          }
        }
      ]
    );
  };

  if (currentView === 'report') {
    return <ReportScreen onBack={() => setCurrentView('dashboard')} cars={cars} />;
  }

  if (currentView === 'notification') {
    return <NotificationScreen onBack={() => setCurrentView('dashboard')} cars={cars} />;
  }

  if (currentView === 'settings') {
    return <SettingsScreen onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'repairHistory') {
    return <RepairHistoryScreen onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'paymentHistory') {
    return <PaymentHistoryScreen onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tableau de Bord Admin</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Voitures</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.enAttente}</Text>
            <Text style={styles.statLabel}>En Attente</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.enCours}</Text>
            <Text style={styles.statLabel}>En Cours</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.revenuTotal.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Revenu Total</Text>
          </View>
        </View>

        <View style={styles.recentCarsCard}>
          <Text style={styles.cardTitle}>Réparations Récentes</Text>
          {recentCars.map((car) => (
            <View key={car.id} style={styles.carItem}>
              <View style={styles.carInfo}>
                <Text style={styles.carText}>{car.brand} {car.model}</Text>
                <Text style={styles.plateText}>{car.plate}</Text>
                <Text style={styles.problemText}>{car.problem}</Text>
                <Text style={styles.priceText}>{car.estimatedPrice.toLocaleString()} Ar</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: car.status === 'en_attente' ? '#f59e0b' : 
                                   car.status === 'en_cours' ? '#3b82f6' : 
                                   car.status === 'termine' ? '#10b981' : '#8b5cf6' }
              ]}>
                <Text style={styles.statusText}>
                  {car.status === 'en_attente' ? 'En attente' : 
                   car.status === 'en_cours' ? 'En cours' : 
                   car.status === 'termine' ? 'Terminé' : 'Payé'}
                </Text>
              </View>
              
              {car.status !== 'termine' && car.status !== 'paye' && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => updateCarStatus(car.id, 'termine')}
                >
                  <Text style={styles.completeButtonText}>Terminer</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Menu Flottant à Droite */}
      <TouchableOpacity 
        style={styles.floatingMenuButton}
        onPress={() => setShowQuickActions(!showQuickActions)}
      >
        <Text style={styles.floatingMenuText}>≡</Text>
      </TouchableOpacity>

      {showQuickActions && (
        <View style={styles.floatingMenu}>
          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => { setCurrentView('repairHistory'); setShowQuickActions(false); }}
          >
            <Text style={styles.floatingMenuItemText}>Historique Réparations</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => { setCurrentView('paymentHistory'); setShowQuickActions(false); }}
          >
            <Text style={styles.floatingMenuItemText}>Historique Paiements</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => { setCurrentView('report'); setShowQuickActions(false); }}
          >
            <Text style={styles.floatingMenuItemText}>Générer Rapport</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => { setCurrentView('notification'); setShowQuickActions(false); }}
          >
            <Text style={styles.floatingMenuItemText}>Envoyer Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => { setCurrentView('settings'); setShowQuickActions(false); }}
          >
            <Text style={styles.floatingMenuItemText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      )}
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
  waitingCard: {
    backgroundColor: '#fef3c7',
  },
  progressCard: {
    backgroundColor: '#dbeafe',
  },
  completedCard: {
    backgroundColor: '#d1fae5',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  revenueTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  revenueSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  recentCarsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  carItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  carInfo: {
    flex: 1,
  },
  carText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  plateText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  problemText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  recentInfo: {
    flex: 1,
  },
  recentCar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 3,
  },
  recentProblem: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 3,
  },
  recentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    paddingVertical: 10,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  quickActionsModal: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionsContent: {
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  quickActionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  quickActionText: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingMenuButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },
  floatingMenuText: {
    fontSize: 24,
    color: '#fff',
  },
  floatingMenu: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  floatingMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  floatingMenuItemText: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '500',
  },
});

export default AdminDashboardScreen;
