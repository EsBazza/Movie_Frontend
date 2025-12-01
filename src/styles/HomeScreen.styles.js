import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/Constants';

const CARD_WIDTH = 110;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121214',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f23',
    gap: 12,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_LIGHT,
  },
  brandAccent: {
    color: COLORS.SUCCESS_GREEN,
  },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#2b2b2f',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navLink: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
  signInLink: {
    color: COLORS.PRIMARY_ACCENT,
  },
  signedInBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.SUCCESS_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signedInText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 16,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loaderText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 4,
  },
  cardLoading: {
    opacity: 0.6,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: 165,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#1e1e22',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 165,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  cardTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 12,
    fontWeight: '600',
  },
  cardYear: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
  ratingBadge: {
    marginTop: 4,
  },
  ratingText: {
    color: COLORS.STAR_RATING,
    fontSize: 11,
    fontWeight: '600',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  errorBanner: {
    backgroundColor: '#4c1b1b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#ffb4b4',
    textAlign: 'center',
    fontSize: 13,
  },
});
