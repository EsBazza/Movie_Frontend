import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  Modal,
  TextInput,
  StatusBar,
  Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { apiEndpoints } from '../services/api';
import { COLORS } from '../constants/Constants';

const { width } = Dimensions.get('window');

const PlaylistsScreen = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { signOut } = useAuth();

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.playlists.getAll();
      const data = response.data.results || response.data;
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching playlists:", error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        Alert.alert("Session Expired", "Please sign in again.");
        signOut();
      } else {
        Alert.alert("Error", "Could not fetch playlists. Check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [])
  );

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name.");
      return;
    }

    setCreating(true);
    try {
      await apiEndpoints.playlists.create(newPlaylistName.trim(), newPlaylistDescription.trim());
      Alert.alert("Success", "Playlist created!");
      setModalVisible(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      fetchPlaylists();
    } catch (error) {
      console.error("Error creating playlist:", error);
      Alert.alert("Error", "Could not create playlist.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePlaylist = (id, title) => {
    Alert.alert(
      "Delete Playlist",
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiEndpoints.playlists.delete(id);
              fetchPlaylists();
            } catch (error) {
              console.error("Error deleting playlist:", error);
              Alert.alert("Error", "Could not delete playlist.");
            }
          },
        },
      ]
    );
  };

  const getProgressPercentage = (watched, total) => {
    if (!total || total === 0) return 0;
    return Math.round((watched / total) * 100);
  };

  const renderItem = ({ item }) => {
    const progress = getProgressPercentage(item.watched_count || 0, item.movie_count || 0);
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('PlaylistDetail', { playlist: item })}
        activeOpacity={0.7}
      >
        {/* Playlist Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.playlistIcon}>🎬</Text>
        </View>

        {/* Playlist Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
          ) : null}
          
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {item.watched_count || 0}/{item.movie_count || 0} watched
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => handleDeletePlaylist(item.id, item.title)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎥</Text>
      <Text style={styles.emptyTitle}>No Playlists Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first playlist to start tracking movies!
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.emptyButtonText}>Create Playlist</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Playlists</Text>
      <Text style={styles.headerSubtitle}>
        {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
      </Text>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: COLORS.BACKGROUND_DARK,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
    });
  }, [navigation, signOut]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY_ACCENT} />
        <Text style={styles.loadingText}>Loading playlists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          playlists.length === 0 && styles.emptyListContent
        ]}
        ListHeaderComponent={playlists.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB - Only show if there are playlists */}
      {playlists.length > 0 && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}

      {/* Create Playlist Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Playlist name"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Description (optional)"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={newPlaylistDescription}
              onChangeText={setNewPlaylistDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setNewPlaylistName('');
                  setNewPlaylistDescription('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalCreateButton, creating && styles.modalButtonDisabled]}
                onPress={handleCreatePlaylist}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
                ) : (
                  <Text style={styles.modalCreateText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
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
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  
  // Header
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
  },

  // Playlist Card
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_ACCENT + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  playlistIcon: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  progressSection: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: 2,
    marginBottom: 6,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: COLORS.PRIMARY_ACCENT,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: COLORS.PRIMARY_ACCENT,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // FAB
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY_ACCENT,
    right: 20,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY_ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '300',
    marginTop: -2,
  },

  // Sign Out
  signOutButton: {
    marginRight: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signOutText: {
    color: COLORS.PRIMARY_ACCENT,
    fontWeight: '600',
    fontSize: 14,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_ACCENT + '30',
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.BACKGROUND_DARK,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 16,
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY_ACCENT,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalCreateText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlaylistsScreen;