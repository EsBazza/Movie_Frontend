import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/Constants';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      <AppNavigator />
    </AuthProvider>
  );
}
