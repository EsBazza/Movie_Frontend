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

const AppNavigatorWrapper = () => {
  const { userToken } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
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
        {/* Public screens - always available */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Protected screens - only when authenticated */}
        {userToken && (
          <>
            <Stack.Screen 
              name="Playlists" 
              component={PlaylistsScreen}
              options={{ title: 'My Playlists' }}
            />
            <Stack.Screen 
              name="PlaylistDetail" 
              component={PlaylistDetailScreen}
              options={{ title: 'Playlist Details' }}
            />
            <Stack.Screen 
              name="AddMovie" 
              component={AddMovieScreen}
              options={{ title: 'Add Movie to Playlist' }}
            />
            <Stack.Screen 
              name="EditMovie" 
              component={EditMovieScreen}
              options={{ title: 'Update Movie Status' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigatorWrapper;