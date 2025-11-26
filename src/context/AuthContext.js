import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/Constants';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
  // ensure axios has the token for subsequent requests
  setAuthToken(token);
      } catch (e) {
        console.error("Failed to load token:", e);
      }
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const signIn = async (token) => {
    setUserToken(token);
  setAuthToken(token);
    await AsyncStorage.setItem('userToken', token);
  };

  const signOut = async () => {
    setUserToken(null);
  setAuthToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  const contextValue = useMemo(() => ({
    userToken,
    isLoading,
    signIn,
    signOut,
  }), [userToken, isLoading]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND_DARK }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY_ACCENT} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};