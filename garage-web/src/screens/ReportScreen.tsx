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

const ReportScreen = ({ onBack, cars }: { 
  onBack: () => void;
  cars: Car[];
}) => {
  const [selectedReportType, setSelectedReportType] = useState('');

  const reportTypes = [
    { id: 'global', name: 'Rapport Global', description: 'Statistiques complètes du garage' },
    { id: 'reparations', name: 'Rapport des Réparations', description: 'Détail de toutes les réparations' },
    { id: 'revenus', name: 'Rapport des Revenus', description: 'Analyse financière' },
    { id: 'clients', name: 'Rapport Clients', description: 'Informations clients' }
  ];

  const generateReport = (type: string) => {
    const stats = {
      total: cars.length,
      enAttente: cars.filter(c => c.status === 'en_attente').length,
      enCours: cars.filter(c => c.status === 'en_cours').length,
      termine: cars.filter(c => c.status === 'termine').length,
      revenuTotal: cars.filter(c => c.status === 'termine').reduce((sum, c) => sum + c.estimatedPrice, 0)
    };

    let reportContent = '';

    switch (type) {
      case 'global':
        reportContent = `RAPPORT GLOBAL\n\n` +
          `Date: ${new Date().toLocaleDateString()}\n` +
          `Total voitures: ${stats.total}\n` +
          `En attente: ${stats.enAttente}\n` +
          `En cours: ${stats.enCours}\n` +
          `Terminées: ${stats.termine}\n` +
          `Revenu total: ${stats.revenuTotal.toLocaleString()} Ar`;
        break;
      case 'reparations':
        reportContent = `RAPPORT DES RÉPARATIONS\n\n` +
          cars.map(car => 
            `${car.brand} ${car.model} (${car.plate})\n  Status: ${car.status}\n  Coût: ${car.estimatedPrice.toLocaleString()} Ar\n`
          ).join('\n');
        break;
      case 'revenus':
        reportContent = `RAPPORT DES REVENUS\n\n` +
          `Revenu total: ${stats.revenuTotal.toLocaleString()} Ar\n` +
          `Moyenne par réparation: ${stats.termine > 0 ? Math.round(stats.revenuTotal / stats.termine).toLocaleString() : 0} Ar\n` +
          `Réparations payées: ${stats.termine}`;
        break;
      case 'clients':
        reportContent = `RAPPORT CLIENTS\n\n` +
          `Total clients: ${stats.total}\n` +
          `Réparations en cours: ${stats.enCours}\n` +
          `Réparations terminées: ${stats.termine}`;
        break;
    }

    Alert.alert('Rapport Généré', reportContent, [{ text: 'OK', onPress: onBack }]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Générer un Rapport</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Choisissez le type de rapport à générer:</Text>
        
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.reportOption,
              selectedReportType === type.id && styles.selectedOption
            ]}
            onPress={() => setSelectedReportType(type.id)}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{type.name}</Text>
              <Text style={styles.optionDescription}>{type.description}</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedReportType === type.id && styles.radioButtonSelected
            ]} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.generateButton, !selectedReportType && styles.disabledButton]}
          onPress={() => selectedReportType && generateReport(selectedReportType)}
          disabled={!selectedReportType}
        >
          <Text style={styles.generateButtonText}>Générer le Rapport</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  reportOption: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  radioButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  generateButton: {
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
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportScreen;
