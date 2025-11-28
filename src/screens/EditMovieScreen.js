import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE_URL, COLORS, STATUS_CHOICES } from '../constants/Constants';
import { apiEndpoints } from '../services/api';

const AddMovieScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('to_watch');
  const [searching, setSearching] = useState(false);

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term.");
      return;
    }

    setSearching(true);
    try {
      // Search for movies using TMDB API through your backend
      const response = await axios.get(
        `${API_BASE_URL}/api/tmdb/search/`,
        { params: { query: searchQuery } }
      );
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Could not search for movies. Please check your backend connection.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddMovie = async (tmdbId, movieTitle) => {
    try {
      // First, get or create the movie from TMDB
      const movieResponse = await apiEndpoints.movies.getOrCreate(tmdbId);

      const movieId = movieResponse.data.id;

      // Then add to playlist
      await apiEndpoints.playlists.addMovie(playlist.id, movieId, selectedStatus);

      Alert.alert("Success", `${movieTitle} added to playlist!`);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding movie:", error);
      if (error.response?.status === 400) {
        Alert.alert("Error", "Movie is already in this playlist.");
      } else {
        Alert.alert("Error", "Could not add movie to playlist.");
      }
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => handleAddMovie(item.id, item.title)}
    >
      {item.poster_path ? (
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          style={styles.poster}
        />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>No Image</Text>
        </View>
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultYear}>
          {item.release_date ? new Date(item.release_date).getFullYear() : 'Unknown year'}
        </Text>
        <Text style={styles.resultOverview} numberOfLines={3}>
          {item.overview || 'No description available.'}
        </Text>
        <Text style={styles.addText}>Tap to add →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Add Movies to "{playlist.title}"</Text>
        
        <Text style={styles.label}>Search for Movies*</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter movie title..."
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchMovies}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchMovies}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Default Status for Added Movies</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
            dropdownIconColor={COLORS.PRIMARY_ACCENT}
          >
            {STATUS_CHOICES.map(choice => (
              <Picker.Item 
                key={choice.value} 
                label={choice.label} 
                value={choice.value} 
                color={COLORS.TEXT_LIGHT} 
              />
            ))}
          </Picker>
        </View>

        {searching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY_ACCENT} />
            <Text style={styles.searchingText}>Searching TMDB...</Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Search Results ({searchResults.length} found):</Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSearchResult}
              scrollEnabled={false}
              style={styles.resultsList}
            />
          </View>
        )}

        {searchResults.length === 0 && !searching && searchQuery && (
          <Text style={styles.noResultsText}>No movies found. Try a different search term.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    marginHorizontal: 20,
    color: COLORS.TEXT_LIGHT,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_ACCENT + '50',
    backgroundColor: COLORS.CARD_DARK,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY_ACCENT,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_ACCENT + '50',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: COLORS.TEXT_LIGHT,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  searchingText: {
    color: COLORS.TEXT_MUTED,
    marginTop: 10,
    fontSize: 14,
  },
  resultsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 15,
  },
  resultsList: {
    marginBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY_ACCENT,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  noPoster: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.TEXT_MUTED,
  },
  noPosterText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
    textAlign: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  resultYear: {
    fontSize: 14,
    color: COLORS.PRIMARY_ACCENT,
    fontWeight: '500',
    marginBottom: 6,
  },
  resultOverview: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    lineHeight: 16,
    marginBottom: 8,
  },
  addText: {
    fontSize: 12,
    color: COLORS.SUCCESS_GREEN,
    fontWeight: '500',
    textAlign: 'right',
  },
  noResultsText: {
    textAlign: 'center',
    color: COLORS.TEXT_MUTED,
    marginVertical: 20,
    marginHorizontal: 20,
    fontSize: 14,
  },
});

export default AddMovieScreen;