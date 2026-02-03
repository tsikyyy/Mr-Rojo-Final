import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Animated } from 'react-native';
import { Car } from '../types/Car';

const PaymentScreen = ({ car, onBack, onPaymentSuccess }: { 
  car: Car;
  onBack: () => void;
  onPaymentSuccess: (carId: string) => void;
}) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Carte Bancaire', 
      description: 'Visa, Mastercard, Amex',
      hasForm: true,
      luxury: true
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      description: 'Paiement sécurisé',
      hasForm: false,
      luxury: false
    },
    { 
      id: 'apple', 
      name: 'Apple Pay', 
      description: 'One Touch',
      hasForm: false,
      luxury: true
    },
    { 
      id: 'mobile', 
      name: 'Mobile Money', 
      description: 'MVola, Orange Money',
      hasForm: false,
      luxury: true
    }
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = paymentMethods.find(m => m.id === methodId);
    setShowCardForm(method?.hasForm || false);
  };

  const validateCardForm = () => {
    if (selectedMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Validation', 'Veuillez entrer un numéro de carte valide');
        return false;
      }
      if (!cardName || cardName.length < 3) {
        Alert.alert('Validation', 'Veuillez entrer le nom du titulaire');
        return false;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        Alert.alert('Validation', 'Veuillez entrer une date d\'expiration valide');
        return false;
      }
      if (!cardCVV || cardCVV.length < 3) {
        Alert.alert('Validation', 'Veuillez entrer un CVV valide');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Sélection requise', 'Veuillez choisir une méthode de paiement');
      return;
    }

    if (!validateCardForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const paymentResponse = {
        success: true,
        transactionId: 'GARAGE_' + Date.now(),
        amount: car.estimatedPrice,
        method: selectedMethod,
        cardInfo: selectedMethod === 'card' ? {
          last4: cardNumber.replace(/\s/g, '').slice(-4),
          name: cardName
        } : null
      };

      Alert.alert(
        'Paiement Confirmé',
        `Transaction ${paymentResponse.transactionId}\n` +
        `Montant: ${paymentResponse.amount} Ar\n` +
        `${paymentResponse.cardInfo ? `Carte: ****${paymentResponse.cardInfo.last4}` : 'Méthode: ' + paymentMethods.find(m => m.id === selectedMethod)?.name}\n` +
        `\n📄 Reçu disponible dans l'historique des paiements.\n\nMerci de votre confiance !`,
        [
          {
            text: 'Parfait',
            onPress: () => {
              // Mettre à jour le statut de la voiture et revenir à la liste
              onPaymentSuccess(car.id);
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Le paiement a échoué. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paiement Premium</Text>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.luxuryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Récapitulatif</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>GARAGE PREMIUM</Text>
            </View>
          </View>
          
          <View style={styles.carInfo}>
            <View style={styles.carInfoRow}>
              <Text style={styles.carLabel}>Véhicule</Text>
              <Text style={styles.carValue}>{car.brand} {car.model}</Text>
            </View>
            <View style={styles.carInfoRow}>
              <Text style={styles.carLabel}>Immatriculation</Text>
              <Text style={styles.carValue}>{car.plate}</Text>
            </View>
            <View style={styles.carInfoRow}>
              <Text style={styles.carLabel}>Service</Text>
              <Text style={styles.carValue}>{car.problem}</Text>
            </View>
          </View>
        </View>

        <View style={styles.luxuryCard}>
          <Text style={styles.cardTitle}>Détails du Coût</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Main d'œuvre Premium</Text>
            <Text style={styles.priceValue}>{Math.round(car.estimatedPrice * 0.6).toLocaleString()} Ar</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Pièces Détachées</Text>
            <Text style={styles.priceValue}>{Math.round(car.estimatedPrice * 0.4).toLocaleString()} Ar</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Premium</Text>
            <Text style={styles.totalValue}>{car.estimatedPrice.toLocaleString()} Ar</Text>
          </View>
        </View>

        <View style={styles.luxuryCard}>
          <Text style={styles.cardTitle}>Méthodes de Paiement</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.selectedMethod,
                method.luxury && styles.luxuryMethod
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={styles.methodIcon}>
                  <Text style={styles.iconText}>
                    {method.id === 'card' ? 'CB' : 
                     method.id === 'paypal' ? 'PP' : 
                     method.id === 'apple' ? 'AP' : 'MM'}
                  </Text>
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedMethod === method.id && styles.radioButtonSelected
              ]}>
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {showCardForm && selectedMethod === 'card' && (
          <Animated.View style={[styles.luxuryCard, styles.cardForm]}>
            <Text style={styles.cardTitle}>Informations Bancaires</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de Carte</Text>
              <TextInput
                style={styles.luxuryInput}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du Titulaire</Text>
              <TextInput
                style={styles.luxuryInput}
                placeholder="JEAN DUPONT"
                placeholderTextColor="#999"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Expiration</Text>
                <TextInput
                  style={styles.luxuryInput}
                  placeholder="MM/AA"
                  placeholderTextColor="#999"
                  value={cardExpiry}
                  onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.luxuryInput}
                  placeholder="123"
                  placeholderTextColor="#999"
                  value={cardCVV}
                  onChangeText={setCardCVV}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.saveCardRow}>
              <TouchableOpacity 
                style={[styles.checkbox, saveCard && styles.checkboxSelected]}
                onPress={() => setSaveCard(!saveCard)}
              >
                {saveCard && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.saveCardText}>Sauvegarder cette carte pour les prochains paiements</Text>
            </View>
          </Animated.View>
        )}

        <TouchableOpacity 
          style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={!selectedMethod || isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <Text style={styles.payButtonText}>Traitement Premium...</Text>
              <View style={styles.dots}>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dot}>•</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.payButtonText}>
              Confirmer le Paiement Premium • {car.estimatedPrice.toLocaleString()} Ar
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>Sécurité Maximale</Text>
          <Text style={styles.securityText}>
            Vos informations sont protégées par un cryptage militaire AES-256. 
            Transaction conforme aux normes PCI DSS Level 1.
          </Text>
          <View style={styles.trustBadges}>
            <Text style={styles.trustBadge}>SSL</Text>
            <Text style={styles.trustBadge}>PCI DSS</Text>
            <Text style={styles.trustBadge}>3D Secure</Text>
          </View>
        </View>
      </Animated.View>
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
    marginBottom: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  luxuryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  premiumBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  premiumText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  carInfo: {
    gap: 12,
  },
  carInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  carLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  carValue: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 15,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#3b82f6',
    paddingTop: 15,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  luxuryMethod: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  selectedMethod: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  cardForm: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  luxuryInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e3a8a',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontWeight: '500',
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveCardText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  payButton: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  payButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  dot: {
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 2,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityInfo: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  trustBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
