import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import tmdbService from '../services/tmdbService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/Constants';
import styles from '../styles/HomeScreen.styles';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addingMovie, setAddingMovie] = useState(null);
  const { userToken } = useAuth();

  const fetchMovies = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await tmdbService.getPopular('movie', pageNum);
      if (!response.success) {
        throw new Error(response.error || 'Unable to load movies');
      }
      const formatted = tmdbService.formatMoviesData(response.data.results || []);
      
      if (append) {
        setMovies(prev => [...prev, ...formatted]);
      } else {
        setMovies(formatted);
      }
      
      setHasMore(pageNum < (response.data.total_pages || 1));
      setPage(pageNum);
    } catch (error) {
      console.error('Home movies error:', error.message);
      setErrorMessage('Could not load movies right now.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const loadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      fetchMovies(page + 1, true);
    }
  };

  const handleMoviePress = async (movie) => {
    if (!userToken) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add movies to your playlists.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    setAddingMovie(movie.id);
    try {
      const result = await tmdbService.getOrCreateMovie(movie.id, movie.media_type || 'movie');
      if (result.success) {
        Alert.alert(
          'Movie Added',
          `"${movie.title}" has been added to the database. You can now add it to your playlists.`,
          [
            { text: 'OK' },
            { text: 'Go to Playlists', onPress: () => navigation.navigate('Playlists') }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Could not add movie.');
      }
    } catch (error) {
      console.error('Add movie error:', error);
      Alert.alert('Error', 'Could not add movie to database.');
    } finally {
      setAddingMovie(null);
    }
  };

  const handlePlaylistPress = () => {
    if (!userToken) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to view your playlists.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    navigation.navigate('Playlists');
  };

  const handleSignInPress = () => {
    navigation.navigate('Login');
  };

  const renderMovieCard = ({ item }) => {
    const isAdding = addingMovie === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.card, isAdding && styles.cardLoading]}
        onPress={() => handleMoviePress(item)}
        activeOpacity={0.7}
        disabled={isAdding}
      >
        {item.poster_url ? (
          <Image source={{ uri: item.poster_url }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardPlaceholder]}>
            <Text style={styles.placeholderText}>No art</Text>
          </View>
        )}
        {isAdding && (
          <View style={styles.cardOverlay}>
            <ActivityIndicator color={COLORS.TEXT_LIGHT} />
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.release_year && (
          <Text style={styles.cardYear}>{item.release_year}</Text>
        )}
        {item.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>Popular Movies</Text>
      <Text style={styles.sectionSubtitle}>Tap any movie to add it to your collection</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
        <Text style={styles.loaderText}>Loading more movies...</Text>
      </View>
    );
  };

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
          <TouchableOpacity onPress={handlePlaylistPress}>
            <Text style={styles.navLink}>Playlist</Text>
          </TouchableOpacity>
          {!userToken ? (
            <TouchableOpacity onPress={handleSignInPress}>
              <Text style={[styles.navLink, styles.signInLink]}>Sign in</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.signedInBadge}>
              <Text style={styles.signedInText}>✓</Text>
            </View>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY_ACCENT} />
          <Text style={styles.loaderText}>Loading movies...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieCard}
          numColumns={3}
          contentContainerStyle={styles.scrollContent}
          columnWrapperStyle={styles.cardRow}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;
