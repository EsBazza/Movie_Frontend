import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import tmdbService from '../services/tmdbService';
import { apiEndpoints } from '../services/api';
import { COLORS } from '../constants/Constants';
import styles from '../styles/HomeScreen.styles';

const SECTION_LIMIT = 10;
const sectionKeys = ['trending', 'newReleases', 'topMovies', 'topSeries', 'topAnime'];

const HomeScreen = ({ navigation }) => {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topSeries, setTopSeries] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(
    sectionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  const [sectionErrors, setSectionErrors] = useState(
    sectionKeys.reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );
  const [refreshing, setRefreshing] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [detailTrailerUrl, setDetailTrailerUrl] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [addingPlaylistId, setAddingPlaylistId] = useState(null);

  const sectionData = {
    trending,
    newReleases,
    topMovies,
    topSeries,
    topAnime,
  };

  const formatSectionData = (results) =>
    tmdbService.formatMoviesData(results || []).slice(0, SECTION_LIMIT);

  const sectionConfigs = {
    trending: {
      title: 'Trending Now',
      subtitle: 'Hot picks across movies & series',
      fetcher: () => tmdbService.getPopular('tv', 1),
      setter: setTrending,
    },
    newReleases: {
      title: 'New Releases',
      subtitle: 'Fresh movies added to TrackR',
      fetcher: () => tmdbService.getPopular('movie', 1),
      setter: setNewReleases,
    },
    topMovies: {
      title: 'Top Rated Movies',
      subtitle: 'Critics and crowd favorites',
      fetcher: () => tmdbService.getTopRated('movie', 1),
      setter: setTopMovies,
    },
    topSeries: {
      title: 'Top Rated Series',
      subtitle: 'Binge-worthy shows of all time',
      fetcher: () => tmdbService.getTopRated('tv', 1),
      setter: setTopSeries,
    },
    topAnime: {
      title: 'Top Rated Anime',
      subtitle: 'Animation legends & cult classics',
      fetcher: () => tmdbService.getTopRated('anime', 1),
      setter: setTopAnime,
    },
  };

  const runSectionFetch = async (key, config) => {
    setSectionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await config.fetcher();
      if (!response.success) {
        throw new Error(response.error || 'Unable to load this section');
      }
      config.setter(formatSectionData(response.data.results));
      setSectionErrors((prev) => ({ ...prev, [key]: null }));
    } catch (error) {
      console.error(`Home section ${key} error:`, error.message);
      config.setter([]);
      setSectionErrors((prev) => ({ ...prev, [key]: error.message }));
    } finally {
      setSectionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const heroSpotlight = trending[0] || newReleases[0] || topMovies[0] || topSeries[0] || null;

  const fetchAllSections = async () => {
    await Promise.all(
      sectionKeys.map((key) => runSectionFetch(key, sectionConfigs[key]))
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllSections();
    setRefreshing(false);
  };

  const fetchPlaylists = async () => {
    setPlaylistLoading(true);
    try {
      const response = await apiEndpoints.playlists.getAll();
      const list = response.data.results || response.data;
      const normalized = Array.isArray(list) ? list : [];
      setPlaylists(normalized);
      setPlaylistError(null);
    } catch (error) {
      console.error('Playlist preview error:', error.message);
      setPlaylists([]);
      setPlaylistError('Unable to load your playlists.');
    } finally {
      setPlaylistLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSections();
    fetchPlaylists();
  }, []);

  const closeDetail = () => {
    setDetailVisible(false);
    setDetailData(null);
    setDetailError(null);
    setDetailTrailerUrl(null);
  };

  const handleOpenPlaylists = () => {
    navigation.navigate('Playlists');
  };

  const handleOpenPlaylistDetail = (playlist) => {
    if (playlist) {
      navigation.navigate('PlaylistDetail', { playlist });
    }
  };

  const handleOpenAddMovie = (playlist) => {
    if (playlist) {
      navigation.navigate('AddMovie', { playlist });
    }
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    setSelectedMovie(null);
    setAddingPlaylistId(null);
  };

  const handleQuickAddPress = (movie) => {
    if (!playlists.length) {
      Alert.alert('No Playlists', 'Create a playlist first via the + button.');
      return;
    }
    setSelectedMovie(movie);
    setAddModalVisible(true);
  };

  const handleAddToPlaylist = async (playlist) => {
    if (!selectedMovie) return;
    setAddingPlaylistId(playlist.id);
    try {
      const movieResponse = await tmdbService.getOrCreateMovie(
        selectedMovie.id,
        selectedMovie.media_type
      );
      if (!movieResponse.success) {
        throw new Error(movieResponse.error || 'Unable to sync movie data.');
      }
      const movieRecord = movieResponse.data;
      await apiEndpoints.playlists.addMovie(playlist.id, movieRecord.id, 'to_watch');
      Alert.alert(
        'Added',
        `${movieRecord.title || selectedMovie.title} is now in ${playlist.title}.`
      );
      closeAddModal();
    } catch (error) {
      console.error('Add to playlist error:', error.message || error);
      if (error.response?.status === 400) {
        Alert.alert('Already Added', 'This title already exists in that playlist.');
      } else {
        Alert.alert('Oops', 'Could not add the title right now.');
      }
    } finally {
      setAddingPlaylistId(null);
    }
  };

  const handleShowDetail = async (movie) => {
    setDetailVisible(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailData(null);
    try {
      const fetcher = movie.media_type === 'tv'
        ? tmdbService.getTVDetails(movie.id)
        : tmdbService.getMovieDetails(movie.id);
      const response = await fetcher;
      if (!response.success) {
        throw new Error(response.error || 'Unable to load details');
      }
      setDetailData({ ...response.data, media_type: movie.media_type });
      setDetailTrailerUrl(tmdbService.getTrailerUrl(response.data));
    } catch (error) {
      console.error('Detail fetch error:', error.message);
      setDetailError(error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const getPlaylistProgress = (playlist) => {
    if (!playlist || !playlist.movie_count) return 0;
    return Math.round(
      ((playlist.watched_count || 0) / playlist.movie_count) * 100
    );
  };

  const renderPlaylistCard = ({ item }) => {
    const progress = getPlaylistProgress(item);
    return (
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle} numberOfLines={1}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.previewSubtitle} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <View style={styles.previewProgressBarBackground}>
          <View style={[styles.previewProgressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.previewMeta}>
          {item.watched_count || 0}/{item.movie_count || 0} watched
        </Text>
        <View style={styles.previewActionRow}>
          <TouchableOpacity
            style={styles.previewSecondaryButton}
            onPress={() => handleOpenPlaylistDetail(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.previewSecondaryText}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.previewPrimaryButton}
            onPress={() => handleOpenAddMovie(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.previewPrimaryText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPlaylistShelf = () => {
    if (playlistLoading) {
      return (
        <View style={styles.previewCard}>
          <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
          <Text style={styles.previewLoadingText}>Loading your playlist...</Text>
        </View>
      );
    }

    if (playlistError) {
      return (
        <View style={styles.previewCard}>
          <Text style={styles.previewErrorText}>{playlistError}</Text>
          <TouchableOpacity style={styles.previewRetryButton} onPress={fetchPlaylists}>
            <Text style={styles.previewRetryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!playlists.length) {
      return (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>No playlists yet</Text>
          <Text style={styles.previewSubtitle}>
            Build your first watchlist to keep everything in sync.
          </Text>
          <TouchableOpacity style={styles.previewPrimaryButton} onPress={handleOpenPlaylists}>
            <Text style={styles.previewPrimaryText}>Create a playlist</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.previewShelf}>
        <View style={styles.previewShelfHeader}>
          <View>
            <Text style={styles.previewShelfTitle}>Your Playlists</Text>
            <Text style={styles.previewShelfSubtitle}>Scroll sideways to browse everything.</Text>
          </View>
          <TouchableOpacity onPress={handleOpenPlaylists}>
            <Text style={styles.previewShelfAction}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderPlaylistCard}
          contentContainerStyle={styles.previewShelfList}
          ItemSeparatorComponent={() => <View style={styles.previewShelfSpacer} />}
        />
      </View>
    );
  };

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Text style={styles.heroEyebrow}>Just Added</Text>
      <View style={styles.heroSpotlight}>
        {heroSpotlight ? (
          <ImageBackground
            source={{ uri: heroSpotlight.backdrop_url || heroSpotlight.poster_url }}
            style={styles.heroBackdrop}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroBadge}>Featured</Text>
              <Text style={styles.heroTitle}>{heroSpotlight.title}</Text>
              <Text style={styles.heroDescription} numberOfLines={3}>
                {heroSpotlight.overview || 'Dive into the story everyone is talking about.'}
              </Text>
              <View style={styles.heroActionRow}>
                <TouchableOpacity
                  style={styles.heroPrimaryButton}
                  onPress={() => handleShowDetail(heroSpotlight)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.heroPrimaryText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.heroSecondaryButton}
                  onPress={() => handleQuickAddPress(heroSpotlight)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.heroSecondaryText}>Add to Playlist</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.heroBackdrop, styles.heroFallback]}>
            <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
          </View>
        )}
      </View>
    </View>
  );

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.sectionCard}
      activeOpacity={0.8}
      onPress={() => handleShowDetail(item)}
    >
      {item.poster_url ? (
        <Image source={{ uri: item.poster_url }} style={styles.sectionCardImage} />
      ) : (
        <View style={[styles.sectionCardImage, styles.cardPlaceholder]}>
          <Text style={styles.placeholderText}>No art</Text>
        </View>
      )}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMetaText}>{item.release_year || 'TBD'}</Text>
        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={(event) => {
            event.stopPropagation?.();
            handleQuickAddPress(item);
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (key) => {
    const config = sectionConfigs[key];
    const data = sectionData[key];
    const loading = sectionLoading[key];
    const error = sectionErrors[key];

    return (
      <View key={key} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{config.title}</Text>
            <Text style={styles.sectionSubtitle}>{config.subtitle}</Text>
          </View>
          <TouchableOpacity onPress={() => runSectionFetch(key, config)}>
            <Text style={styles.reloadLink}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.sectionLoader}>
            <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
            <Text style={styles.loaderText}>Loading {config.title.toLowerCase()}...</Text>
          </View>
        ) : error ? (
          <View style={styles.sectionErrorBanner}>
            <Text style={styles.sectionErrorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCard}
            keyExtractor={(item) => `${key}-${item.id}`}
            ItemSeparatorComponent={() => <View style={styles.sectionSpacer} />}
            contentContainerStyle={styles.sectionList}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      <View style={styles.stickyHeader}>
        <Text style={styles.stickyTitle}>TRACKR</Text>
        <TouchableOpacity onPress={handleOpenPlaylists}>
          <Text style={styles.stickyNavButton}>Playlists</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeroSection()}
        {renderPlaylistShelf()}
        {sectionKeys.map((key) => renderSection(key))}
      </ScrollView>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddModal}
      >
        <View style={styles.addModalOverlay}>
          <View style={styles.addModalContent}>
            <Text style={styles.addModalTitle}>Add to Playlist</Text>
            {selectedMovie && (
              <Text style={styles.addModalSubtitle} numberOfLines={1}>
                {selectedMovie.title}
              </Text>
            )}
            {playlists.length ? (
              <ScrollView
                style={styles.addModalList}
                showsVerticalScrollIndicator={false}
              >
                {playlists.map((playlist) => {
                  const busy = addingPlaylistId === playlist.id;
                  return (
                    <TouchableOpacity
                      key={playlist.id}
                      style={styles.addModalRow}
                      onPress={() => handleAddToPlaylist(playlist)}
                      disabled={busy}
                    >
                      <View>
                        <Text style={styles.addModalRowTitle}>{playlist.title}</Text>
                        <Text style={styles.addModalRowSubtitle}>
                          {playlist.movie_count || 0} titles · {getPlaylistProgress(playlist)}% watched
                        </Text>
                      </View>
                      {busy ? (
                        <ActivityIndicator size="small" color={COLORS.PRIMARY_ACCENT} />
                      ) : (
                        <Text style={styles.addModalRowAction}>Add</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.addModalEmpty}>Create a playlist first.</Text>
            )}
            <TouchableOpacity
              style={styles.addModalCancel}
              onPress={closeAddModal}
            >
              <Text style={styles.addModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={detailVisible}
        transparent
        animationType="slide"
        onRequestClose={closeDetail}
      >
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeDetail}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            {detailLoading ? (
              <View style={styles.detailLoader}>
                <ActivityIndicator color={COLORS.PRIMARY_ACCENT} />
                <Text style={styles.loaderText}>Loading details...</Text>
              </View>
            ) : detailError ? (
              <View style={styles.sectionErrorBanner}>
                <Text style={styles.sectionErrorText}>{detailError}</Text>
              </View>
            ) : detailData ? (
              <ScrollView
                contentContainerStyle={styles.detailScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.detailPosterSection}>
                  {detailData.poster_path ? (
                    <Image
                      source={{ uri: tmdbService.getImageUrl(detailData.poster_path, 'w500') }}
                      style={styles.detailPoster}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.detailPoster, styles.detailNoPoster]}>
                      <Text style={styles.detailNoPosterText}>🎬</Text>
                    </View>
                  )}
                  {detailTrailerUrl && (
                    <TouchableOpacity
                      style={styles.playTrailerButton}
                      onPress={() => Linking.openURL(detailTrailerUrl)}
                    >
                      <Text style={styles.playButtonIcon}>▶</Text>
                      <Text style={styles.playButtonText}>Watch Trailer</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.detailInfoSection}>
                  <Text style={styles.detailTitle}>{detailData.title || detailData.name}</Text>
                  <View style={styles.detailMetaRow}>{(() => {
                    const releaseYear = detailData.release_date?.slice(0, 4) || detailData.first_air_date?.slice(0, 4);
                    const runtimeMinutes = detailData.runtime || detailData.episode_run_time?.[0];
                    const seasons = detailData.number_of_seasons;
                    const rating = detailData.vote_average;
                    const badges = [];
                    if (releaseYear) {
                      badges.push({ label: `📅 ${releaseYear}`, key: 'year' });
                    }
                    if (runtimeMinutes) {
                      badges.push({ label: `⏱️ ${runtimeMinutes}m`, key: 'runtime' });
                    }
                    if (seasons) {
                      badges.push({ label: `📺 ${seasons} seasons`, key: 'seasons' });
                    }
                    if (rating) {
                      badges.push({ label: `⭐ ${rating.toFixed(1)}`, key: 'rating' });
                    }
                    return badges.map((badge) => (
                      <View key={badge.key} style={styles.metaBadge}>
                        <Text style={styles.metaBadgeText}>{badge.label}</Text>
                      </View>
                    ));
                  })()}</View>
                  {detailData.genres?.length ? (
                    <Text style={styles.detailGenres} numberOfLines={2}>
                      {detailData.genres.map((g) => g.name).join(', ')}
                    </Text>
                  ) : null}
                  <Text style={styles.detailOverview}>
                    {detailData.overview || 'No overview available.'}
                  </Text>

                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={styles.detailActionButton}
                      onPress={() => handleQuickAddPress({
                        id: detailData.id,
                        media_type: detailData.media_type,
                        title: detailData.title || detailData.name,
                      })}
                    >
                      <Text style={styles.detailActionText}>Add to Playlist</Text>
                    </TouchableOpacity>

                    {detailTrailerUrl && (
                      <TouchableOpacity
                        style={[styles.detailActionButton, styles.youtubeButton]}
                        onPress={() => Linking.openURL(detailTrailerUrl)}
                      >
                        <Text style={styles.detailActionText}>Open Trailer</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenPlaylists}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
