import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Modal,
} from 'react-native';
import { apiEndpoints } from '../services/api';
import tmdbService from '../services/tmdbService';
import { COLORS, STATUS_CHOICES } from '../constants/Constants';
import styles from '../styles/AddMovieScreen.styles';

const MEDIA_FILTERS = [
  { label: 'All', value: 'multi', subtitle: 'Movies & Shows' },
  { label: 'Movies', value: 'movie', subtitle: 'Box office & classics' },
  { label: 'Series', value: 'tv', subtitle: 'TV & streaming' },
];

const TAB_OPTIONS = [
  { key: 'search', label: 'Search' },
  { key: 'popular_movies', label: 'Popular Movies' },
  { key: 'popular_tv', label: 'Popular Series' },
];


const AddMovieScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('to_watch');
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [mediaFilter, setMediaFilter] = useState('multi');
  const [activeTab, setActiveTab] = useState('search');
  const [popularResults, setPopularResults] = useState([]);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularPage, setPopularPage] = useState(1);
  const [popularHasMore, setPopularHasMore] = useState(true);
  const [popularType, setPopularType] = useState('movie');

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term.");
      return;
    }

    setSearching(true);
    try {
      const result = await tmdbService.searchMovies(searchQuery, 1, mediaFilter);
      
      if (result.success) {
        setSearchResults(result.data.results || []);
        if (!result.data.results?.length) {
          Alert.alert("No Results", "No titles found for your search.");
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

  const handleAddMovie = async (tmdbId, movieTitle, mediaType = 'movie') => {
    setAdding(tmdbId);
    try {
      const movieResult = await tmdbService.getOrCreateMovie(tmdbId, mediaType);
      
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

  const fetchPopular = async (type, page = 1, replace = false) => {
    setPopularLoading(true);
    try {
      const result = await tmdbService.getPopular(type, page);
      if (result.success) {
        const newResults = result.data?.results || [];
        setPopularResults((prev) => (replace ? newResults : [...prev, ...newResults]));
        const totalPages = result.data?.total_pages || page;
        setPopularHasMore(page < totalPages);
        setPopularPage(page);
      } else {
        Alert.alert('Popular Titles', result.error || 'Unable to load titles.');
        setPopularHasMore(false);
      }
    } catch (error) {
      console.error('Popular fetch error:', error);
      Alert.alert('Popular Titles', 'Could not load popular titles.');
      setPopularHasMore(false);
    } finally {
      setPopularLoading(false);
    }
  };

  const initializePopular = (type) => {
    setPopularType(type);
    setPopularResults([]);
    setPopularPage(1);
    setPopularHasMore(true);
    fetchPopular(type, 1, true);
  };

  useEffect(() => {
    if (activeTab === 'popular_movies') {
      initializePopular('movie');
    } else if (activeTab === 'popular_tv') {
      initializePopular('tv');
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Movie',
      headerStyle: { backgroundColor: COLORS.BACKGROUND_DARK },
      headerTintColor: COLORS.TEXT_LIGHT,
    });
  }, [navigation]);

  const loadMorePopular = () => {
    if (activeTab === 'search' || popularLoading || !popularHasMore) {
      return;
    }
    fetchPopular(popularType, popularPage + 1);
  };

  const isSearchTab = activeTab === 'search';
  const listData = isSearchTab ? searchResults : popularResults;
  const listLoading = isSearchTab ? searching : popularLoading;

  const renderSearchResult = ({ item }) => {
    const formattedMovie = tmdbService.formatMovieData(item);
    const isAdding = adding === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.resultCard, isAdding && styles.resultCardDisabled]}
        onPress={() => !isAdding && handleAddMovie(item.id, formattedMovie.title, formattedMovie.media_type)}
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
          <View style={styles.resultHeaderRow}>
            <Text style={styles.resultTitle} numberOfLines={2}>{formattedMovie.title}</Text>
            <View style={styles.mediaTypeBadge}>
              <Text style={styles.mediaTypeText}>
                {formattedMovie.media_type === 'tv' ? 'Series' : 'Movie'}
              </Text>
            </View>
          </View>
          
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
      <Text style={styles.emptyIcon}>{isSearchTab ? '🔍' : '🍿'}</Text>
      <Text style={styles.emptyTitle}>
        {isSearchTab ? 'Search Movies & Series' : 'Nothing to show just yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isSearchTab
          ? 'Enter a title above, then filter between films or shows to find the perfect match for your playlist.'
          : 'Pull down or tap refresh to try again, or switch tabs to explore other picks.'}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <Text style={styles.playlistName}>Adding to: {playlist.title}</Text>

      <View style={styles.tabRow}>
        {TAB_OPTIONS.map((tab) => {
          const selected = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabChip, selected && styles.tabChipActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabChipText, selected && styles.tabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
            {STATUS_CHOICES.find((s) => s.value === selectedStatus)?.label}
          </Text>
        </View>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>

      {isSearchTab ? (
        <>
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

          <View style={styles.filterRow}>
            {MEDIA_FILTERS.map((filter) => {
              const isActive = mediaFilter === filter.value;
              return (
                <TouchableOpacity
                  key={filter.value}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setMediaFilter(filter.value)}
                  disabled={searching}
                >
                  <Text style={[styles.filterChipLabel, isActive && styles.filterChipLabelActive]}>
                    {filter.label}
                  </Text>
                  <Text style={[styles.filterChipSubtitle, isActive && styles.filterChipSubtitleActive]}>
                    {filter.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.tabInfoCard}>
          <Text style={styles.tabInfoTitle}>
            {activeTab === 'popular_movies' ? 'Top movies right now' : 'Trending TV series'}
          </Text>
          <Text style={styles.tabInfoSubtitle}>
            Scroll to keep loading more titles. Tap any card to add it instantly.
          </Text>
        </View>
      )}
    </View>
  );

  const renderListFooter = () => {
    if (isSearchTab) {
      return null;
    }

    if (!popularHasMore && !popularLoading) {
      return (
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>You reached the end of this list.</Text>
        </View>
      );
    }

    if (!popularLoading) {
      return null;
    }

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
        <Text style={styles.listFooterText}>Loading more fan favorites...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />

      <FlatList
        data={listData}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : `fallback-${index}`)}
        renderItem={renderSearchResult}
        contentContainerStyle={[
          styles.resultsList,
          listData.length === 0 && !listLoading ? styles.emptyListContent : null,
        ]}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={!listLoading ? renderEmptyState : null}
        ListFooterComponent={renderListFooter}
        onEndReached={loadMorePopular}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent
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
                  selectedStatus === status.value && styles.statusOptionSelected,
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
                {selectedStatus === status.value && <Text style={styles.selectedCheck}>✓</Text>}
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

export default AddMovieScreen;