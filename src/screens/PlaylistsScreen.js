import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Modal,
  TextInput,
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { apiEndpoints } from '../services/api';
import { COLORS } from '../constants/Constants';
import styles from '../styles/PlaylistsScreen.styles';

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

export default PlaylistsScreen;