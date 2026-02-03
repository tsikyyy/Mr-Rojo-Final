import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CarListScreen from './src/screens/CarListScreen';
import AddCarScreen from './src/screens/AddCarScreen';
import CarDetailScreen from './src/screens/CarDetailScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import RepairHistoryScreen from './src/screens/RepairHistoryScreen';
import PaymentHistoryScreen from './src/screens/PaymentHistoryScreen';
import UserStatsScreen from './src/screens/UserStatsScreen';
import UserNotificationScreen from './src/screens/UserNotificationScreen';
import { Car } from './src/types/Car';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'carList' | 'addCar' | 'carDetail' | 'adminDashboard' | 'payment' | 'repairHistory' | 'paymentHistory' | 'userStats' | 'userNotifications'>('login');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      brand: 'Renault',
      model: 'Clio',
      plate: 'ABC 123',
      problem: 'Vidange moteur: Huile moteur noire et niveau bas',
      status: 'en_attente',
      estimatedPrice: 45000
    },
    {
      id: '2',
      brand: 'Toyota',
      model: 'Yaris',
      plate: 'XYZ 789',
      problem: 'Réparation freinage: Plaquettes de frein usées',
      status: 'en_cours',
      estimatedPrice: 85000
    },
    {
      id: '3',
      brand: 'Peugeot',
      model: '308',
      plate: 'DEF 456',
      problem: 'Changement pneus: Usure irrégulière des pneus',
      status: 'termine',
      estimatedPrice: 95000
    }
  ]);

  const handleLogin = (email: string = 'user@demo.com') => {
    setCurrentUser(email);
    if (email === 'admin@garage.com') {
      setCurrentScreen('adminDashboard');
    } else {
      setCurrentScreen('carList');
    }
  };
  const handleRegister = () => setCurrentScreen('carList');
  const handleGoToRegister = () => setCurrentScreen('register');
  const handleGoToLogin = () => setCurrentScreen('login');
  const handleLogout = () => setCurrentScreen('login');
  const handleAddCar = () => setCurrentScreen('addCar');
  const handleBack = () => setCurrentScreen('carList');
  const handleCarDetail = (car: Car) => {
    setSelectedCar(car);
    setCurrentScreen('carDetail');
  };
  const handlePayment = () => {
    if (selectedCar) {
      setCurrentScreen('payment');
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedCar) {
      const updatedCars = cars.map(car => 
        car.id === selectedCar.id 
          ? { ...car, status: 'termine' as const }
          : car
      );
      setCars(updatedCars);
      Alert.alert('✅ Paiement Confirmé', 'Merci pour votre confiance !');
      setCurrentScreen('carList');
    }
  };
  const handleCarAdded = (newCar: Car) => {
    setCars([...cars, newCar]);
    setCurrentScreen('carList');
    Alert.alert('Succès', 'Voiture ajoutée avec succès !');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onGoToRegister={handleGoToRegister} 
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onRegister={handleRegister} 
            onGoToLogin={handleGoToLogin} 
          />
        );
      case 'carList':
        return (
          <CarListScreen 
            onAddCar={handleAddCar}
            onCarDetail={handleCarDetail}
            onLogout={handleLogout}
            cars={cars}
          />
        );
      case 'addCar':
        return (
          <AddCarScreen 
            onBack={handleBack}
            onCarAdded={handleCarAdded}
          />
        );
      case 'carDetail':
        return selectedCar ? (
          <CarDetailScreen 
            car={selectedCar}
            onBack={handleBack}
            onPayment={handlePayment}
          />
        ) : null;
      case 'adminDashboard':
        return (
          <AdminDashboardScreen 
            onBack={handleLogout}
            cars={cars}
            onUpdateCar={(carId, newStatus) => {
              const updatedCars = cars.map(car => 
                car.id === carId 
                  ? { ...car, status: newStatus }
                  : car
              );
              setCars(updatedCars);
            }}
          />
        );
      case 'payment':
        return selectedCar ? (
          <PaymentScreen 
            car={selectedCar}
            onBack={() => setCurrentScreen('carDetail')}
            onPaymentSuccess={(carId) => {
              // Mettre à jour le statut de la voiture et le revenu
              const updatedCars = cars.map(car => 
                car.id === carId 
                  ? { ...car, status: 'paye' as const }
                  : car
              );
              setCars(updatedCars);
              setCurrentScreen('carList');
            }}
          />
        ) : null;
      case 'repairHistory':
        return (
          <RepairHistoryScreen 
            onBack={() => setCurrentScreen('carList')}
          />
        );
      case 'paymentHistory':
        return (
          <PaymentHistoryScreen 
            onBack={() => setCurrentScreen('adminDashboard')}
            onRetryPayment={(paymentId) => {
              // Trouver le paiement correspondant et rediriger vers la page de paiement
              const paymentData = {
                id: paymentId,
                amount: 85000, // Montant par défaut
                description: 'Réparation véhicule'
              };
              setSelectedCar({
                id: '1',
                brand: 'Toyota',
                model: 'Yaris',
                plate: 'XYZ 789',
                problem: 'Réparation freinage',
                status: 'en_cours',
                estimatedPrice: paymentData.amount
              });
              setCurrentScreen('payment');
            }}
          />
        );
      case 'userStats':
        return (
          <UserStatsScreen 
            onBack={() => setCurrentScreen('carList')}
            userCars={cars}
          />
        );
      case 'userNotifications':
        return (
          <UserNotificationScreen 
            onBack={() => setCurrentScreen('carList')}
          />
        );
      default:
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onGoToRegister={handleGoToRegister} 
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
