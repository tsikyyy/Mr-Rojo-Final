import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';

const LoginScreen = ({ onLogin, onGoToRegister }: { onLogin: (email: string) => void; onGoToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(
        'Champs Requis',
        'Veuillez remplir tous les champs pour vous connecter.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const validUsers = [
        { email: 'admin@garage.com', password: 'admin123', name: 'Admin Garage' },
        { email: 'user@demo.com', password: 'demo123', name: 'Utilisateur Demo' },
        { email: 'jean@dupont.com', password: 'jean123', name: 'Jean Dupont' },
        { email: 'marie@martin.com', password: 'marie123', name: 'Marie Martin' }
      ];

      const user = validUsers.find(u => u.email === email && u.password === password);

      if (user) {
        onLogin(user.email);
      } else {
        Alert.alert(
          'Erreur de Connexion',
          'Email ou mot de passe incorrect.\n\nVeuillez vérifier vos identifiants ou créer un compte.',
          [
            { text: 'OK', style: 'default' },
            { text: 'Créer un compte', onPress: onGoToRegister }
          ]
        );
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Garage Premium</Text>
        <Text style={styles.subtitle}>Connexion</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.luxuryCard}>
          <Text style={styles.cardTitle}>Bienvenue</Text>
          <Text style={styles.cardDescription}>
            Connectez-vous pour accéder à votre espace personnel et gérer vos réparations.
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.luxuryInput}
              placeholder="votre@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              style={styles.luxuryInput}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.loginButtonText}>Connexion...</Text>
            ) : (
              <Text style={styles.loginButtonText}>Se Connecter</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={onGoToRegister}>
            <Text style={styles.linkText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Comptes de démonstration:</Text>
          <Text style={styles.demoText}>admin@garage.com / admin123</Text>
          <Text style={styles.demoText}>user@demo.com / demo123</Text>
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
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e40af',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#60a5fa',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  luxuryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 25,
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
  loginButton: {
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
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    marginRight: 5,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  demoText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 3,
  },
});

export default LoginScreen;
