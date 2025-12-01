import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image,
  StatusBar,
  Modal,
  ScrollView,
  Linking
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { apiEndpoints } from '../services/api';
import tmdbService from '../services/tmdbService';
import { COLORS, STATUS_CHOICES } from '../constants/Constants';
import styles from '../styles/PlaylistDetailScreen.styles';

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
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [tvSeasons, setTvSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const { signOut } = useAuth();

  const closeDetailModal = () => {
    setMovieDetailModalVisible(false);
    setShowTrailer(false);
    setIsTrailerPlaying(false);
    resetTVShowState();
  };

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

  const resetTVShowState = () => {
    setTvSeasons([]);
    setSeasonEpisodes([]);
    setSelectedSeasonNumber(null);
    setSeasonsLoading(false);
    setEpisodesLoading(false);
  };

  const handleSelectSeason = async (tmdbId, seasonNumber) => {
    setSelectedSeasonNumber(seasonNumber);
    setEpisodesLoading(true);
    try {
      const result = await tmdbService.getTVSeason(tmdbId, seasonNumber);
      if (result.success) {
        setSeasonEpisodes(result.data?.episodes || []);
      } else {
        Alert.alert('Season Details', result.error || 'Unable to load episodes.');
      }
    } finally {
      setEpisodesLoading(false);
    }
  };

  const loadTVSeasons = async (tmdbId) => {
    if (!tmdbId) return;
    setSeasonsLoading(true);
    try {
      const result = await tmdbService.getTVDetails(tmdbId);
      if (result.success) {
        const seasons = (result.data?.seasons || []).filter((season) => season.season_number !== 0);
        setTvSeasons(seasons);
        if (seasons.length) {
          handleSelectSeason(tmdbId, seasons[0].season_number);
        } else {
          setSeasonEpisodes([]);
        }
      } else {
        Alert.alert('TV Details', result.error || 'Unable to load seasons.');
      }
    } finally {
      setSeasonsLoading(false);
    }
  };

  const openMovieDetail = (item) => {
    setSelectedMovieForDetail(item);
    setShowTrailer(false);
    setIsTrailerPlaying(false);
    resetTVShowState();
    if (item.movie.media_type === 'tv' && item.movie.tmdb_id) {
      loadTVSeasons(item.movie.tmdb_id);
    }
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
        onRequestClose={closeDetailModal}
      >
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeDetailModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedMovieForDetail && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Poster Section */}
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
                  
                  {/* Play Trailer Button - Opens YouTube */}
                  {selectedMovieForDetail.movie.youtube_id && (
                    <TouchableOpacity 
                      style={styles.playTrailerButton}
                      onPress={() => {
                        Linking.openURL(`https://www.youtube.com/watch?v=${selectedMovieForDetail.movie.youtube_id}`);
                      }}
                    >
                      <Text style={styles.playButtonIcon}>▶</Text>
                      <Text style={styles.playButtonText}>Watch Trailer</Text>
                    </TouchableOpacity>
                  )}
                </View>

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

                  {selectedMovieForDetail.movie.media_type === 'tv' && (
                    <>
                      <View style={styles.seasonSection}>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionLabel}>Seasons</Text>
                          {seasonsLoading && (
                            <ActivityIndicator size="small" color={COLORS.PRIMARY_ACCENT} />
                          )}
                        </View>
                        {tvSeasons.length ? (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.seasonChipsRow}>
                              {tvSeasons.map((season) => {
                                const isActive = selectedSeasonNumber === season.season_number;
                                return (
                                  <TouchableOpacity
                                    key={season.id || season.season_number}
                                    style={[styles.seasonChip, isActive && styles.seasonChipActive]}
                                    onPress={() => handleSelectSeason(selectedMovieForDetail.movie.tmdb_id, season.season_number)}
                                  >
                                    <Text style={[styles.seasonChipLabel, isActive && styles.seasonChipLabelActive]}>
                                      Season {season.season_number}
                                    </Text>
                                    <Text style={[styles.seasonChipMeta, isActive && styles.seasonChipMetaActive]}>
                                      {season.episode_count} eps
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </ScrollView>
                        ) : (
                          !seasonsLoading && (
                            <Text style={styles.emptySeasonsText}>Seasons unavailable for this title.</Text>
                          )
                        )}
                      </View>

                      {selectedSeasonNumber && (
                        <View style={styles.episodesSection}>
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>Episodes · Season {selectedSeasonNumber}</Text>
                            {episodesLoading && (
                              <ActivityIndicator size="small" color={COLORS.PRIMARY_ACCENT} />
                            )}
                          </View>
                          {seasonEpisodes.length ? (
                            seasonEpisodes.map((episode) => (
                              <View key={episode.id || episode.episode_number} style={styles.episodeCard}>
                                <View style={styles.episodeNumberBadge}>
                                  <Text style={styles.episodeNumberText}>{episode.episode_number}</Text>
                                </View>
                                <View style={styles.episodeContent}>
                                  <Text style={styles.episodeTitle}>{episode.name || `Episode ${episode.episode_number}`}</Text>
                                  <Text style={styles.episodeMeta}>
                                    {episode.air_date || 'TBA'} · {episode.runtime ? `${episode.runtime}m` : 'Runtime TBA'}
                                  </Text>
                                  {episode.overview ? (
                                    <Text style={styles.episodeOverview} numberOfLines={3}>
                                      {episode.overview}
                                    </Text>
                                  ) : null}
                                </View>
                              </View>
                            ))
                          ) : (
                            !episodesLoading && (
                              <Text style={styles.emptyEpisodesText}>Select a season to view episodes.</Text>
                            )
                          )}
                        </View>
                      )}
                    </>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.detailActions}>
                    <TouchableOpacity 
                      style={styles.detailActionButton}
                      onPress={() => {
                        closeDetailModal();
                        setSelectedMovie(selectedMovieForDetail);
                        setTimeout(() => setStatusModalVisible(true), 300);
                      }}
                    >
                      <Text style={styles.detailActionIcon}>🔄</Text>
                      <Text style={styles.detailActionText}>Change Status</Text>
                    </TouchableOpacity>

                    {selectedMovieForDetail.movie.youtube_id && (
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
                        closeDetailModal();
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

export default PlaylistDetailScreen;
