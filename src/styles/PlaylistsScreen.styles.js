import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/Constants';

const { width } = Dimensions.get('window');

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
