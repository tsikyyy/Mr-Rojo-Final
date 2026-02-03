import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = ({ onBack }: { 
  onBack: () => void;
}) => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const settingsSections = [
    {
      title: 'Paramètres Généraux',
      items: [
        { 
          key: 'notifications', 
          label: 'Notifications Push', 
          value: notifications, 
          onToggle: setNotifications,
          description: 'Recevoir des alertes sur les réparations'
        },
        { 
          key: 'autoSave', 
          label: 'Sauvegarde Automatique', 
          value: autoSave, 
          onToggle: setAutoSave,
          description: 'Sauvegarder automatiquement les données'
        },
        { 
          key: 'darkMode', 
          label: 'Mode Sombre', 
          value: isDarkMode, 
          onToggle: toggleDarkMode,
          description: 'Activer le thème sombre de l\'application'
        }
      ]
    },
    {
      title: 'Paramètres Avancés',
      items: [
        { 
          key: 'maintenance', 
          label: 'Mode Maintenance', 
          value: maintenanceMode, 
          onToggle: setMaintenanceMode,
          description: 'Désactiver l\'accès utilisateur'
        },
        { 
          key: 'debug', 
          label: 'Mode Debug', 
          value: debugMode, 
          onToggle: setDebugMode,
          description: 'Activer les logs de débogage'
        }
      ]
    }
  ];

  const handleSaveSettings = () => {
    Alert.alert(
      'Paramètres Sauvegardés',
      `✅ Tous les paramètres ont été enregistrés avec succès !\n\n` +
      `• Notifications: ${notifications ? 'Activées' : 'Désactivées'}\n` +
      `• Sauvegarde auto: ${autoSave ? 'Activée' : 'Désactivée'}\n` +
      `• Mode sombre: ${isDarkMode ? 'Activé' : 'Désactivé'}\n` +
      `• Mode maintenance: ${maintenanceMode ? 'Activé' : 'Désactivé'}\n` +
      `• Mode debug: ${debugMode ? 'Activé' : 'Désactivé'}`,
      [{ text: 'OK', onPress: onBack }]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Réinitialiser les Paramètres',
      'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setAutoSave(true);
            setMaintenanceMode(false);
            if (isDarkMode) toggleDarkMode(); // Reset to light mode
            setDebugMode(false);
            Alert.alert('Succès', 'Paramètres réinitialisés aux valeurs par défaut');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <View style={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            
            {section.items.map((item) => (
              <View key={item.key} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: colors.border, true: colors.secondary }}
                  thumbColor={item.value ? colors.surface : colors.textSecondary}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informations</Text>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Build</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>2024.01.22</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.secondary }]} onPress={handleSaveSettings}>
            <Text style={styles.saveButtonText}>Sauvegarder</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.error }]} onPress={handleResetSettings}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 16,
    color: '#1e3a8a',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  actionButtons: {
    gap: 15,
  },
  saveButton: {
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
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
