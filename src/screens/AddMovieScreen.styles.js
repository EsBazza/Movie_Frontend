import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/Constants';

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  listHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.CARD_DARK,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    paddingTop: 80,
  },
});

const tabStyles = StyleSheet.create({
  playlistName: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  tabChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BACKGROUND_DARK,
    backgroundColor: COLORS.BACKGROUND_DARK,
    alignItems: 'center',
  },
  tabChipActive: {
    backgroundColor: COLORS.PRIMARY_ACCENT,
    borderColor: COLORS.PRIMARY_ACCENT,
  },
  tabChipText: {
    color: COLORS.TEXT_MUTED,
    fontWeight: '600',
    fontSize: 14,
  },
  tabChipTextActive: {
    color: COLORS.TEXT_LIGHT,
  },
  tabInfoCard: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
  },
  tabInfoTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  tabInfoSubtitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    lineHeight: 18,
  },
});

const statusStyles = StyleSheet.create({
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusSelectorLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
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
});

const searchStyles = StyleSheet.create({
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
});

const filterStyles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.BACKGROUND_DARK,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  filterChipActive: {
    borderColor: COLORS.PRIMARY_ACCENT,
    backgroundColor: COLORS.PRIMARY_ACCENT + '10',
  },
  filterChipLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipLabelActive: {
    color: COLORS.PRIMARY_ACCENT,
  },
  filterChipSubtitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
  filterChipSubtitleActive: {
    color: COLORS.TEXT_LIGHT,
  },
});

const listStyles = StyleSheet.create({
  listFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  listFooterText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
  },
});

const cardStyles = StyleSheet.create({
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
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  resultTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    flex: 1,
  },
  mediaTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_ACCENT + '20',
    alignSelf: 'flex-start',
  },
  mediaTypeText: {
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
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
});

const emptyStateStyles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
});

const modalStyles = StyleSheet.create({
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

export default {
  ...layoutStyles,
  ...tabStyles,
  ...statusStyles,
  ...searchStyles,
  ...filterStyles,
  ...listStyles,
  ...cardStyles,
  ...emptyStateStyles,
  ...modalStyles,
};
