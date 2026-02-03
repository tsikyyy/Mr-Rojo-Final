import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SimpleHomeScreen = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue dans Garage App</Text>
        <Text style={styles.subtitle}>Gérez vos réparations automobiles</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>🚗 Mes Voitures</Text>
          <Text style={styles.cardDescription}>Voir et gérer vos véhicules</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>🔧 Nouvelle Réparation</Text>
          <Text style={styles.cardDescription}>Déclarer un problème</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>💳 Paiements</Text>
          <Text style={styles.cardDescription}>Historique des paiements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SimpleHomeScreen;
