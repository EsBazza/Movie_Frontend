import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  StatusBar,
  Modal,
  Dimensions,
  ScrollView,
  Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { apiEndpoints } from '../services/api';
import { COLORS, STATUS_CHOICES, getStatusByValue } from '../constants/Constants';

const { width, height } = Dimensions.get('window');

const PlaylistDetailScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [items, setItems] = useState([]);
  const [playlistData, setPlaylistData] = useState(playlist);
  const [loading, setLoading] = useState(true);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [movieDetailModalVisible, setMovieDetailModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const { signOut } = useAuth();

  const fetchPlaylistItems = async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.playlists.getById(playlist.id);
      setPlaylistData(response.data);
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching playlist items:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please sign in again.");
        signOut();
      } else {
        Alert.alert("Error", "Could not fetch playlist items.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlaylistItems();
    }, [playlist.id])
  );

  const handleUpdateStatus = async (movieId, newStatus) => {
    try {
      await apiEndpoints.playlists.updateMovieStatus(playlist.id, movieId, newStatus);
      setStatusModalVisible(false);
      fetchPlaylistItems();
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Could not update status.");
    }
  };

  const handleRemoveMovie = (movieId, movieTitle) => {
    Alert.alert(
      "Remove Movie",
      `Remove "${movieTitle}" from playlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await apiEndpoints.playlists.removeMovie(playlist.id, movieId);
              fetchPlaylistItems();
            } catch (error) {
              console.error("Error removing movie:", error);
              Alert.alert("Error", "Could not remove movie.");
            }
          },
        },
      ]
    );
  };

  const openMovieDetail = (item) => {
    setSelectedMovieForDetail(item);
    setShowTrailer(false);
    setMovieDetailModalVisible(true);
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

  const getProgressPercentage = () => {
    const total = playlistData.movie_count || 0;
    const watched = playlistData.watched_count || 0;
    if (total === 0) return 0;
    return Math.round((watched / total) * 100);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Poster - Tappable to open details */}
      <TouchableOpacity 
        onPress={() => openMovieDetail(item)}
        activeOpacity={0.8}
      >
        {item.movie.poster_url ? (
          <Image source={{ uri: item.movie.poster_url }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text style={styles.noPosterText}>🎬</Text>
          </View>
        )}
        <View style={styles.posterOverlay}>
          <Text style={styles.infoIcon}>ℹ️</Text>
        </View>
      </TouchableOpacity>
      
      {/* Movie Info */}
      <View style={styles.movieInfo}>
        <TouchableOpacity onPress={() => openMovieDetail(item)}>
          <Text style={styles.title} numberOfLines={2}>{item.movie.title}</Text>
        </TouchableOpacity>
        {item.movie.release_year && (
          <Text style={styles.year}>{item.movie.release_year}</Text>
        )}
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusIcon, { color: getStatusColor(item.status) }]}>
            {getStatusIcon(item.status)}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {STATUS_CHOICES.find(s => s.value === item.status)?.label}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => {
              setSelectedMovie(item);
              setStatusModalVisible(true);
            }}
          >
            <Text style={styles.statusButtonText}>Change Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveMovie(item.movie.id, item.movie.title)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Progress Ring Visual */}
      <View style={styles.progressRing}>
        <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
        <Text style={styles.progressLabel}>Complete</Text>
      </View>
      
      <View style={styles.headerInfo}>
        <Text style={styles.playlistTitle}>{playlistData.title}</Text>
        {playlistData.description && (
          <Text style={styles.playlistDescription} numberOfLines={2}>
            {playlistData.description}
          </Text>
        )}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{playlistData.movie_count || 0}</Text>
            <Text style={styles.statLabel}>Movies</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: COLORS.SUCCESS_GREEN }]}>
              {playlistData.watched_count || 0}
            </Text>
            <Text style={styles.statLabel}>Watched</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: COLORS.STAR_RATING }]}>
              {(playlistData.movie_count || 0) - (playlistData.watched_count || 0)}
            </Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎬</Text>
      <Text style={styles.emptyTitle}>No Movies Yet</Text>
      <Text style={styles.emptySubtitle}>Add some movies to start tracking!</Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddMovie', { playlist })}
      >
        <Text style={styles.emptyButtonText}>Add Movies</Text>
      </TouchableOpacity>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerStyle: {
        backgroundColor: COLORS.BACKGROUND_DARK,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddMovie', { playlist })}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, playlist]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY_ACCENT} />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={renderEmptyState}
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
            <Text style={styles.modalTitle}>Update Status</Text>
            {selectedMovie && (
              <Text style={styles.modalMovieTitle} numberOfLines={1}>
                {selectedMovie.movie.title}
              </Text>
            )}
            
            {STATUS_CHOICES.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.statusOption,
                  selectedMovie?.status === status.value && styles.statusOptionSelected
                ]}
                onPress={() => handleUpdateStatus(selectedMovie.movie.id, status.value)}
              >
                <Text style={[styles.statusOptionIcon, { color: getStatusColor(status.value) }]}>
                  {getStatusIcon(status.value)}
                </Text>
                <Text style={styles.statusOptionText}>{status.label}</Text>
                {selectedMovie?.status === status.value && (
                  <Text style={styles.currentBadge}>Current</Text>
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

      {/* Movie Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={movieDetailModalVisible}
        onRequestClose={() => {
          setMovieDetailModalVisible(false);
          setShowTrailer(false);
        }}
      >
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setMovieDetailModalVisible(false);
                setShowTrailer(false);
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedMovieForDetail && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Poster / Trailer Section */}
                {showTrailer && selectedMovieForDetail.movie.youtube_id ? (
                  <View style={styles.trailerContainer}>
                    <WebView
                      style={styles.trailerWebView}
                      source={{ 
                        uri: `https://www.youtube.com/embed/${selectedMovieForDetail.movie.youtube_id}?autoplay=1&rel=0&modestbranding=1` 
                      }}
                      allowsFullscreenVideo={true}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                    />
                    <TouchableOpacity 
                      style={styles.hideTrailerButton}
                      onPress={() => setShowTrailer(false)}
                    >
                      <Text style={styles.hideTrailerText}>Hide Trailer</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.detailPosterSection}>
                    {selectedMovieForDetail.movie.poster_url ? (
                      <Image 
                        source={{ uri: selectedMovieForDetail.movie.poster_url }} 
                        style={styles.detailPoster}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.detailPoster, styles.detailNoPoster]}>
                        <Text style={styles.detailNoPosterText}>🎬</Text>
                      </View>
                    )}
                    
                    {/* Play Trailer Button */}
                    {selectedMovieForDetail.movie.youtube_id && (
                      <TouchableOpacity 
                        style={styles.playTrailerButton}
                        onPress={() => setShowTrailer(true)}
                      >
                        <Text style={styles.playButtonIcon}>▶</Text>
                        <Text style={styles.playButtonText}>Watch Trailer</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Movie Info Section */}
                <View style={styles.detailInfoSection}>
                  <Text style={styles.detailTitle}>{selectedMovieForDetail.movie.title}</Text>
                  
                  <View style={styles.detailMetaRow}>
                    {selectedMovieForDetail.movie.release_year && (
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaBadgeText}>
                          📅 {selectedMovieForDetail.movie.release_year}
                        </Text>
                      </View>
                    )}
                    
                    <View style={[
                      styles.metaBadge, 
                      { backgroundColor: getStatusColor(selectedMovieForDetail.status) + '20' }
                    ]}>
                      <Text style={[styles.metaBadgeText, { color: getStatusColor(selectedMovieForDetail.status) }]}>
                        {getStatusIcon(selectedMovieForDetail.status)} {STATUS_CHOICES.find(s => s.value === selectedMovieForDetail.status)?.label}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  {selectedMovieForDetail.movie.description && (
                    <View style={styles.descriptionSection}>
                      <Text style={styles.sectionLabel}>Overview</Text>
                      <Text style={styles.descriptionText}>
                        {selectedMovieForDetail.movie.description}
                      </Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.detailActions}>
                    <TouchableOpacity 
                      style={styles.detailActionButton}
                      onPress={() => {
                        setMovieDetailModalVisible(false);
                        setSelectedMovie(selectedMovieForDetail);
                        setTimeout(() => setStatusModalVisible(true), 300);
                      }}
                    >
                      <Text style={styles.detailActionIcon}>🔄</Text>
                      <Text style={styles.detailActionText}>Change Status</Text>
                    </TouchableOpacity>

                    {selectedMovieForDetail.movie.youtube_id && !showTrailer && (
                      <TouchableOpacity 
                        style={[styles.detailActionButton, styles.youtubeButton]}
                        onPress={() => {
                          Linking.openURL(`https://www.youtube.com/watch?v=${selectedMovieForDetail.movie.youtube_id}`);
                        }}
                      >
                        <Text style={styles.detailActionIcon}>🎥</Text>
                        <Text style={styles.detailActionText}>Open in YouTube</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                      style={[styles.detailActionButton, styles.removeActionButton]}
                      onPress={() => {
                        setMovieDetailModalVisible(false);
                        handleRemoveMovie(selectedMovieForDetail.movie.id, selectedMovieForDetail.movie.title);
                      }}
                    >
                      <Text style={styles.detailActionIcon}>🗑️</Text>
                      <Text style={styles.detailActionText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  loadingText: {
    color: COLORS.TEXT_MUTED,
    marginTop: 10,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyListContent: {
    flexGrow: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY_ACCENT + '20',
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_ACCENT,
  },
  progressLabel: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
  },
  headerInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },

  // Movie Card
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 70,
    height: 105,
    borderRadius: 8,
    marginRight: 14,
  },
  noPoster: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    fontSize: 28,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  year: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 6,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_ACCENT,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: COLORS.DELETE_RED + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 14,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.PRIMARY_ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Add Button
  addButton: {
    marginRight: 16,
    backgroundColor: COLORS.PRIMARY_ACCENT,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
    fontSize: 13,
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
    marginBottom: 8,
  },
  modalMovieTitle: {
    fontSize: 14,
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
  currentBadge: {
    fontSize: 11,
    color: COLORS.PRIMARY_ACCENT,
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

  // Poster Overlay
  posterContainer: {
    position: 'relative',
  },
  posterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0,
  },
  infoIcon: {
    fontSize: 20,
  },

  // Movie Detail Modal
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  detailModalContent: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Detail Poster Section
  detailPosterSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.CARD_DARK,
  },
  detailPoster: {
    width: 200,
    height: 300,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  detailNoPoster: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailNoPosterText: {
    fontSize: 64,
  },
  playTrailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    gap: 8,
  },
  playButtonIcon: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
  },
  playButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Trailer Section
  trailerContainer: {
    width: '100%',
    paddingTop: 50,
  },
  trailerWebView: {
    width: '100%',
    height: 220,
  },
  hideTrailerButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.CARD_DARK,
  },
  hideTrailerText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    fontWeight: '600',
  },

  // Detail Info Section
  detailInfoSection: {
    padding: 24,
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailMetaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  metaBadge: {
    backgroundColor: COLORS.CARD_DARK,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metaBadgeText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Description
  descriptionSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.TEXT_MUTED,
  },

  // Detail Actions
  detailActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  detailActionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD_DARK,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  detailActionIcon: {
    fontSize: 18,
  },
  detailActionText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
  youtubeButton: {
    backgroundColor: '#FF000020',
  },
  removeActionButton: {
    backgroundColor: COLORS.DELETE_RED + '20',
  },
});

export default PlaylistDetailScreen;