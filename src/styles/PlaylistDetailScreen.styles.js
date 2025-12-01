import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/Constants';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.TEXT_MUTED,
  },
  seasonSection: {
    marginBottom: 20,
  },
  seasonChipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  seasonChip: {
    minWidth: 120,
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.CARD_DARK,
  },
  seasonChipActive: {
    borderColor: COLORS.PRIMARY_ACCENT,
    backgroundColor: COLORS.PRIMARY_ACCENT + '15',
  },
  seasonChipLabel: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
  },
  seasonChipLabelActive: {
    color: COLORS.PRIMARY_ACCENT,
  },
  seasonChipMeta: {
    marginTop: 4,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  seasonChipMetaActive: {
    color: COLORS.TEXT_LIGHT,
  },
  emptySeasonsText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
  },
  episodesSection: {
    marginBottom: 24,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  episodeNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY_ACCENT + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeNumberText: {
    color: COLORS.PRIMARY_ACCENT,
    fontWeight: 'bold',
  },
  episodeContent: {
    flex: 1,
  },
  episodeTitle: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
    fontSize: 15,
  },
  episodeMeta: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    marginVertical: 4,
  },
  episodeOverview: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  emptyEpisodesText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
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
