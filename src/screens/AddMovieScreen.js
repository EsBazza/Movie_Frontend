import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native';
import { apiEndpoints } from '../services/api';
import tmdbService from '../services/tmdbService';
import { COLORS, STATUS_CHOICES } from '../constants/Constants';

const { width } = Dimensions.get('window');

const AddMovieScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('to_watch');
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term.");
      return;
    }

    setSearching(true);
    try {
      const result = await tmdbService.searchMovies(searchQuery);
      
      if (result.success) {
        setSearchResults(result.data.results || []);
        if (!result.data.results?.length) {
          Alert.alert("No Results", "No movies found for your search.");
        }
      } else {
        Alert.alert("Search Error", result.error);
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Could not search for movies.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddMovie = async (tmdbId, movieTitle) => {
    setAdding(tmdbId);
    try {
      const movieResult = await tmdbService.getOrCreateMovie(tmdbId);
      
      if (!movieResult.success) {
        Alert.alert("Error", movieResult.error);
        return;
      }

      const movieId = movieResult.data.id;
      await apiEndpoints.playlists.addMovie(playlist.id, movieId, selectedStatus);

      Alert.alert("Success", `"${movieTitle}" added to playlist!`);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding movie:", error);
      if (error.response?.status === 400) {
        Alert.alert("Already Added", "This movie is already in the playlist.");
      } else {
        Alert.alert("Error", "Could not add movie to playlist.");
      }
    } finally {
      setAdding(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'watched': return COLORS.SUCCESS_GREEN;
      case 'watching': return COLORS.STAR_RATING;
      default: return COLORS.TEXT_MUTED;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'watched': return '✓';
      case 'watching': return '▶';
      default: return '○';
    }
  };

  const renderSearchResult = ({ item }) => {
    const formattedMovie = tmdbService.formatMovieData(item);
    const isAdding = adding === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.resultCard, isAdding && styles.resultCardDisabled]}
        onPress={() => !isAdding && handleAddMovie(item.id, item.title)}
        disabled={isAdding}
        activeOpacity={0.7}
      >
        {/* Poster */}
        {formattedMovie.poster_url ? (
          <Image 
            source={{ uri: formattedMovie.poster_url }}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text style={styles.noPosterIcon}>🎬</Text>
          </View>
        )}

        {/* Movie Info */}
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={2}>{formattedMovie.title}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.resultYear}>
              {formattedMovie.release_year || 'Unknown year'}
            </Text>
            {formattedMovie.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{formattedMovie.rating}</Text>
              </View>
            )}
          </View>

          <Text style={styles.resultOverview} numberOfLines={2}>
            {formattedMovie.overview || 'No description available.'}
          </Text>

          {/* Add Button */}
          {isAdding ? (
            <View style={styles.addingContainer}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY_ACCENT} />
              <Text style={styles.addingText}>Adding...</Text>
            </View>
          ) : (
            <View style={styles.addPrompt}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addText}>Tap to add</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>Search for Movies</Text>
      <Text style={styles.emptySubtitle}>
        Enter a movie title above to find and add movies to your playlist
      </Text>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Movie',
      headerStyle: {
        backgroundColor: COLORS.BACKGROUND_DARK,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <Text style={styles.playlistName}>Adding to: {playlist.title}</Text>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchMovies}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchMovies}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
            ) : (
              <Text style={styles.searchButtonText}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Status Selector */}
        <TouchableOpacity 
          style={styles.statusSelector}
          onPress={() => setStatusModalVisible(true)}
        >
          <Text style={styles.statusSelectorLabel}>Add as:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedStatus) + '20' }]}>
            <Text style={[styles.statusBadgeIcon, { color: getStatusColor(selectedStatus) }]}>
              {getStatusIcon(selectedStatus)}
            </Text>
            <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedStatus) }]}>
              {STATUS_CHOICES.find(s => s.value === selectedStatus)?.label}
            </Text>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSearchResult}
        contentContainerStyle={[
          styles.resultsList,
          searchResults.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={!searching ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />

      {/* Status Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Status</Text>
            <Text style={styles.modalSubtitle}>Choose the initial status for added movies</Text>
            
            {STATUS_CHOICES.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.statusOption,
                  selectedStatus === status.value && styles.statusOptionSelected
                ]}
                onPress={() => {
                  setSelectedStatus(status.value);
                  setStatusModalVisible(false);
                }}
              >
                <Text style={[styles.statusOptionIcon, { color: getStatusColor(status.value) }]}>
                  {getStatusIcon(status.value)}
                </Text>
                <Text style={styles.statusOptionText}>{status.label}</Text>
                {selectedStatus === status.value && (
                  <Text style={styles.selectedCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  
  // Search Header
  searchHeader: {
    padding: 16,
    backgroundColor: COLORS.CARD_DARK,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  playlistName: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.PRIMARY_ACCENT,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    padding: 12,
    borderRadius: 10,
  },
  statusSelectorLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeIcon: {
    fontSize: 12,
    marginRight: 6,
    fontWeight: 'bold',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  changeText: {
    marginLeft: 'auto',
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 13,
    fontWeight: '600',
  },

  // Results List
  resultsList: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resultCardDisabled: {
    opacity: 0.6,
  },
  poster: {
    width: 90,
    height: 135,
  },
  noPoster: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterIcon: {
    fontSize: 32,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  resultTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  resultYear: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.STAR_RATING + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  ratingText: {
    color: COLORS.STAR_RATING,
    fontSize: 12,
    fontWeight: '600',
  },
  resultOverview: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  addingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addingText: {
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 12,
  },
  addPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  addText: {
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.CARD_DARK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  statusOptionSelected: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_ACCENT,
  },
  statusOptionIcon: {
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
  },
  statusOptionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
  },
  selectedCheck: {
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddMovieScreen;