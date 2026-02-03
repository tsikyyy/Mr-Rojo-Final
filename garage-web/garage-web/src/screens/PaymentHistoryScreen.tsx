import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

interface Payment {
  id: string;
  repairId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  repairType: string;
  amount: number;
  paymentMethod: 'carte' | 'especes' | 'mobile_money';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
  transactionId?: string;
  receiptUrl?: string;
}

interface PaymentHistoryScreenProps {
  onBack: () => void;
  onRetryPayment?: (paymentId: string) => void;
}

const PaymentHistoryScreen = ({ onBack, onRetryPayment }: PaymentHistoryScreenProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      // Simuler des données historiques de paiements
      const mockPayments: Payment[] = [
        {
          id: 'pay_001',
          repairId: '1',
          vehicleBrand: 'Renault',
          vehicleModel: 'Clio',
          vehiclePlate: 'ABC 123',
          repairType: 'Vidange moteur',
          amount: 45000,
          paymentMethod: 'carte',
          status: 'completed',
          createdAt: '2024-01-15T16:00:00Z',
          completedAt: '2024-01-15T16:02:00Z',
          transactionId: 'TXN_123456789',
          receiptUrl: 'https://garage-premium.com/receipts/TXN_123456789.pdf'
        },
        {
          id: 'pay_002',
          repairId: '5',
          vehicleBrand: 'Ford',
          vehicleModel: 'Focus',
          vehiclePlate: 'JKL 012',
          repairType: 'Climatisation',
          amount: 65000,
          paymentMethod: 'mobile_money',
          status: 'completed',
          createdAt: '2024-01-10T15:00:00Z',
          completedAt: '2024-01-10T15:05:00Z',
          transactionId: 'MM_987654321',
          receiptUrl: 'https://garage-premium.com/receipts/MM_987654321.pdf'
        },
        {
          id: 'pay_003',
          repairId: '7',
          vehicleBrand: 'BMW',
          vehicleModel: 'Série 3',
          vehiclePlate: 'PQR 678',
          repairType: 'Batterie',
          amount: 28000,
          paymentMethod: 'especes',
          status: 'completed',
          createdAt: '2024-01-08T16:00:00Z',
          completedAt: '2024-01-08T16:00:00Z',
          transactionId: 'CASH_456789123'
        },
        {
          id: 'pay_004',
          repairId: '3',
          vehicleBrand: 'Peugeot',
          vehicleModel: '308',
          vehiclePlate: 'DEF 456',
          repairType: 'Changement pneus',
          amount: 95000,
          paymentMethod: 'carte',
          status: 'pending',
          createdAt: '2024-01-18T17:00:00Z',
          transactionId: 'TXN_PENDING_111'
        },
        {
          id: 'pay_005',
          repairId: '6',
          vehicleBrand: 'Volkswagen',
          vehicleModel: 'Golf',
          vehiclePlate: 'MNO 345',
          repairType: 'Suspension',
          amount: 120000,
          paymentMethod: 'carte',
          status: 'failed',
          createdAt: '2024-01-12T16:00:00Z',
          transactionId: 'TXN_FAILED_222'
        },
        {
          id: 'pay_006',
          repairId: '2',
          vehicleBrand: 'Toyota',
          vehicleModel: 'Yaris',
          vehiclePlate: 'XYZ 789',
          repairType: 'Réparation freinage',
          amount: 85000,
          paymentMethod: 'mobile_money',
          status: 'refunded',
          createdAt: '2024-01-20T14:00:00Z',
          completedAt: '2024-01-21T10:00:00Z',
          transactionId: 'MM_REFUND_333'
        }
      ];

      setPayments(mockPayments);
    } catch (error) {
      console.error('Erreur chargement historique paiements:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'historique des paiements');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'refunded': return '#6366f1';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complété';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'carte': return '💳';
      case 'especes': return '💵';
      case 'mobile_money': return '📱';
      default: return '💰';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'carte': return 'Carte bancaire';
      case 'especes': return 'Espèces';
      case 'mobile_money': return 'Mobile Money';
      default: return method;
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

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === filter);

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);

  const downloadReceipt = (receiptUrl: string) => {
    // Simulation du téléchargement du reçu
    Alert.alert(
      'Téléchargement du Reçu',
      'Le reçu est en cours de téléchargement...',
      [{ text: 'OK' }]
    );
    
    // Simulation d'un délai de téléchargement
    setTimeout(() => {
      Alert.alert(
        'Succès',
        'Reçu téléchargé avec succès !\n\n📁 Emplacement: /Downloads/receipt_' + Date.now() + '.pdf\n\n💡 Le fichier est disponible dans votre dossier de téléchargements.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de l'historique des paiements...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historique des Paiements</Text>
      </View>

      <View style={styles.content}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{payments.length}</Text>
            <Text style={styles.statLabel}>Total Paiements</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPaid.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Payé</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPending.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>En Attente</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalRefunded.toLocaleString()} Ar</Text>
            <Text style={styles.statLabel}>Remboursé</Text>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
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

        {/* Liste des paiements */}
        {filteredPayments.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View style={styles.paymentInfo}>
                <Text style={styles.vehicleText}>{payment.vehicleBrand} {payment.vehicleModel}</Text>
                <Text style={styles.plateText}>{payment.vehiclePlate}</Text>
                <Text style={styles.repairType}>{payment.repairType}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                <Text style={styles.statusText}>{getStatusText(payment.status)}</Text>
              </View>
            </View>

            <View style={styles.paymentDetails}>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Montant:</Text>
                <Text style={styles.amountValue}>{payment.amount.toLocaleString()} Ar</Text>
              </View>

              <View style={styles.methodRow}>
                <Text style={styles.methodLabel}>Méthode:</Text>
                <View style={styles.methodContainer}>
                  <Text style={styles.methodIcon}>{getPaymentMethodIcon(payment.paymentMethod)}</Text>
                  <Text style={styles.methodText}>{getPaymentMethodText(payment.paymentMethod)}</Text>
                </View>
              </View>

              <View style={styles.transactionRow}>
                <Text style={styles.transactionLabel}>Transaction:</Text>
                <Text style={styles.transactionValue}>{payment.transactionId}</Text>
              </View>

              <View style={styles.datesRow}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Création:</Text>
                  <Text style={styles.dateValue}>{formatDate(payment.createdAt)}</Text>
                </View>
                {payment.completedAt && (
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Complété:</Text>
                    <Text style={styles.dateValue}>{formatDate(payment.completedAt)}</Text>
                  </View>
                )}
              </View>

              {payment.receiptUrl && payment.status === 'completed' && (
                <TouchableOpacity 
                  style={styles.receiptButton}
                  onPress={() => downloadReceipt(payment.receiptUrl!)}
                >
                  <Text style={styles.receiptButtonText}>📄 Télécharger Reçu</Text>
                </TouchableOpacity>
              )}

              {payment.status === 'failed' && (
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    // Notification de redirection immédiate
                    Alert.alert(
                      'Redirection',
                      'Redirection vers la page de paiement...',
                      [{ text: 'OK' }]
                    );
                    
                    // Redirection immédiate vers la page de paiement
                    setTimeout(() => {
                      if (onRetryPayment) {
                        onRetryPayment(payment.id);
                      }
                    }, 500);
                  }}
                >
                  <Text style={styles.retryButtonText}>🔄 Réessayer le Paiement</Text>
                </TouchableOpacity>
              )}

              {payment.status === 'pending' && (
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingText}>⏳ Paiement en cours de traitement...</Text>
                </View>
              )}
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
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  paymentInfo: {
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
    marginBottom: 4,
  },
  repairType: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
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
  paymentDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  methodLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  methodText: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  transactionValue: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  datesRow: {
    marginBottom: 15,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  dateValue: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  receiptButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingInfo: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pendingText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PaymentHistoryScreen;
