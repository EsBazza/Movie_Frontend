import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import tmdbService from '../services/tmdbService';
import { COLORS } from '../constants/Constants';
import styles from '../styles/HomeScreen.styles';

const SECTION_LIMIT = 10;

const HomeScreen = ({ navigation }) => {
  const [newTitles, setNewTitles] = useState([]);
  const [popularTitles, setPopularTitles] = useState([]);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loadSections = async () => {
      await Promise.all([fetchNewTitles(), fetchPopularTitles()]);
    };
    loadSections();
  }, []);

  const fetchNewTitles = async () => {
    setLoadingNew(true);
    try {
      const response = await tmdbService.getPopular('movie', 1);
      if (!response.success) {
        throw new Error(response.error || 'Unable to load new releases');
      }
      const formatted = tmdbService
        .formatMoviesData(response.data.results || [])
        .slice(0, SECTION_LIMIT);
      setNewTitles(formatted);
    } catch (error) {
      console.error('Home new titles error:', error.message);
      setErrorMessage('Could not load new releases right now.');
    } finally {
      setLoadingNew(false);
    }
  };

  const fetchPopularTitles = async () => {
    setLoadingPopular(true);
    try {
      const response = await tmdbService.getPopular('tv', 1);
      if (!response.success) {
        throw new Error(response.error || 'Unable to load popular titles');
      }
      const formatted = tmdbService
        .formatMoviesData(response.data.results || [])
        .slice(0, SECTION_LIMIT);
      setPopularTitles(formatted);
    } catch (error) {
      console.error('Home popular titles error:', error.message);
      setErrorMessage('Could not load trending picks right now.');
    } finally {
      setLoadingPopular(false);
    }
  };

  const renderSection = (title, data, loading) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {loading ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
          <Text style={styles.loaderText}>Loading {title.toLowerCase()}...</Text>
        </View>
      ) : (
        <View style={styles.cardGrid}>
          {data.map((item) => (
            <View key={`${title}-${item.id}`} style={styles.card}>
              {item.poster_url ? (
                <Image source={{ uri: item.poster_url }} style={styles.cardImage} />
              ) : (
                <View style={[styles.cardImage, styles.cardPlaceholder]}>
                  <Text style={styles.placeholderText}>No art</Text>
                </View>
              )}
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />

      <View style={styles.navBar}>
        <Text style={styles.brand}>
          Track
          <Text style={styles.brandAccent}>R</Text>
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search Bar"
          placeholderTextColor={COLORS.TEXT_MUTED}
        />

        <View style={styles.navLinks}>
          <Text style={styles.navLink}>Films</Text>
          <Text style={styles.navLink}>Series</Text>
          <Text
            style={styles.navLink}
            onPress={() => navigation.navigate('Playlists')}
          >
            Playlist
          </Text>
          <Text style={styles.navLink}>Sign in</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {renderSection('New on TrackR', newTitles, loadingNew)}
        {renderSection('Popular on TrackR', popularTitles, loadingPopular)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
