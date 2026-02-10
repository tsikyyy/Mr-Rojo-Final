// src/services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentUser: any = null;

export const registerUser = async (email: string, password: string, name: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  currentUser = { uid: 'demo_user_' + Date.now(), email, name };
  await AsyncStorage.setItem('user', JSON.stringify(currentUser));
  return currentUser;
};

export const loginUser = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  currentUser = { uid: 'demo_user_' + Date.now(), email, name: email.split('@')[0] };
  await AsyncStorage.setItem('user', JSON.stringify(currentUser));
  return currentUser;
};

export const logoutUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser = null;
  await AsyncStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  if (currentUser) return currentUser;
  try {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
  } catch (error) {
    console.error('Error getting user:', error);
  }
  return null;
};
