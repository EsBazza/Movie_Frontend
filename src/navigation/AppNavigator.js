import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import HomeScreen from '../screens/HomeScreen';
import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import EditMovieScreen from '../screens/EditMovieScreen';
import { COLORS } from '../constants/Constants';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
  <AuthStack.Screen name="Login" component={LoginScreen} />
  <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.BACKGROUND_DARK,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <AppStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <AppStack.Screen 
      name="Playlists" 
      component={PlaylistsScreen}
      options={{ title: 'My Playlists' }}
    />
    <AppStack.Screen 
      name="PlaylistDetail" 
      component={PlaylistDetailScreen}
      options={{ title: 'Playlist Details' }}
    />
    <AppStack.Screen 
      name="AddMovie" 
      component={AddMovieScreen}
      options={{ title: 'Add Movie to Playlist' }}
    />
    <AppStack.Screen 
      name="EditMovie" 
      component={EditMovieScreen}
      options={{ title: 'Update Movie Status' }}
    />
  </AppStack.Navigator>
);

const AppNavigatorWrapper = () => {
  const { userToken } = useAuth();
  const isAuthenticated = !!userToken || __DEV__;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigatorWrapper;