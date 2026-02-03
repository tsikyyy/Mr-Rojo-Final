import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { apiService } from '../services/api';

interface Car {
  id: string;
  brand: string;
  model: string;
  plate: string;
  problem: string;
  status: 'en_attente' | 'en_cours' | 'termine';
  estimatedPrice: number;
}

interface RepairType {
  id: string;
  nom: string;
  prix: number;
  duree_secondes: number;
}

const AddCarScreen = ({ onBack, onCarAdded }: { 
  onBack: () => void;
  onCarAdded: (car: Car) => void;
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [problem, setProblem] = useState('');
  const [selectedRepairType, setSelectedRepairType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repairTypes, setRepairTypes] = useState<RepairType[]>([]);

  // Charger les types de réparations depuis la BDD
  useEffect(() => {
    loadRepairTypes();
  }, []);

  const loadRepairTypes = async () => {
    try {
      const types = await apiService.getRepairTypes();
      setRepairTypes(types);
    } catch (error) {
      console.log('Utilisation des types de réparations par défaut');
      // Utiliser les types par défaut si erreur
      setRepairTypes([
        { id: 'vidange', nom: 'Vidange moteur', prix: 45000, duree_secondes: 3600 },
        { id: 'freinage', nom: 'Réparation freinage', prix: 85000, duree_secondes: 7200 },
        { id: 'climatisation', nom: 'Climatisation', prix: 65000, duree_secondes: 5400 },
        { id: 'suspension', nom: 'Suspension', prix: 120000, duree_secondes: 10800 },
        { id: 'moteur', nom: 'Diagnostic moteur', prix: 35000, duree_secondes: 1800 },
        { id: 'pneus', nom: 'Changement pneus', prix: 95000, duree_secondes: 5400 },
        { id: 'batterie', nom: 'Batterie', prix: 28000, duree_secondes: 1800 },
        { id: 'echappement', nom: 'Échappement', prix: 75000, duree_secondes: 7200 }
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!brand || !model || !plate || !problem || !selectedRepairType) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const selectedType = repairTypes.find(type => type.id === selectedRepairType);
    
    const carData = {
      marque: brand,
      modele: model,
      immatriculation: plate,
      description_panne: `${selectedType?.nom}: ${problem}`,
      utilisateur_id: 1, // À adapter selon l'utilisateur connecté
      type_reparation_id: selectedType
    };

    setIsLoading(true);
    
    try {
      // Envoyer à la vraie base de données
      const newCar = await apiService.addCar(carData);
      
      Alert.alert('Succès', 'Réparation ajoutée avec succès !');
      onCarAdded(newCar);
    } catch (error) {
      console.log('Utilisation du mode hors ligne');
      // Si l'API n'est pas disponible, créer une voiture simulée
      const newCar = {
        id: Date.now().toString(),
        brand: brand,
        model: model,
        plate: plate,
        problem: `${selectedType?.nom}: ${problem}`,
        status: 'en_attente' as const,
        estimatedPrice: selectedType?.prix || 50000
      };
      
      Alert.alert('Succès', 'Réparation ajoutée en mode hors ligne !');
      onCarAdded(newCar);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Déclarer une Réparation</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.luxuryCard}>
          <Text style={styles.cardTitle}>Informations du Véhicule</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Marque</Text>
            <TextInput
              style={styles.luxuryInput}
              placeholder="Ex: Renault, Toyota, Peugeot"
              placeholderTextColor="#999"
              value={brand}
              onChangeText={setBrand}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Modèle</Text>
            <TextInput
              style={styles.luxuryInput}
              placeholder="Ex: Clio, Yaris, 308"
              placeholderTextColor="#999"
              value={model}
              onChangeText={setModel}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Immatriculation</Text>
            <TextInput
              style={styles.luxuryInput}
              placeholder="Ex: ABC 123"
              placeholderTextColor="#999"
              value={plate}
              onChangeText={setPlate}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.luxuryCard}>
          <Text style={styles.cardTitle}>Type de Réparation</Text>
          <Text style={styles.subtitle}>
            {repairTypes.length > 0 ? 'Sélectionnez le type de réparation nécessaire' : 'Chargement...'}
          </Text>
          
          {repairTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.repairType,
                selectedRepairType === type.id && styles.selectedRepairType
              ]}
              onPress={() => setSelectedRepairType(type.id)}
            >
              <View style={styles.repairTypeInfo}>
                <Text style={styles.repairTypeName}>{type.nom}</Text>
                <Text style={styles.repairTypePrice}>{type.prix.toLocaleString()} Ar</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedRepairType === type.id && styles.radioButtonSelected
              ]}>
                {selectedRepairType === type.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.luxuryCard}>
          <Text style={styles.cardTitle}>Description du Problème</Text>
          <Text style={styles.subtitle}>Décrivez plus en détail le problème rencontré</Text>
          
          <TextInput
            style={[styles.luxuryInput, styles.textArea]}
            placeholder="Décrivez les symptômes, bruits, ou problèmes observés..."
            placeholderTextColor="#999"
            value={problem}
            onChangeText={setProblem}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.submitButtonText}>Enregistrement...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer dans la Base</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Connexion Base de Données</Text>
          <Text style={styles.infoText}>
            Cette réparation sera directement enregistrée dans votre base de données Laravel.
          </Text>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  repairType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedRepairType: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  repairTypeInfo: {
    flex: 1,
  },
  repairTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  repairTypePrice: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
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
  submitButton: {
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
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AddCarScreen;
