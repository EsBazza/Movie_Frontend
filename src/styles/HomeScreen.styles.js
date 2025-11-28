import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/Constants';

const CARD_WIDTH = 130;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#121214',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f23',
    gap: 18,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_LIGHT,
  },
  brandAccent: {
    color: COLORS.SUCCESS_GREEN,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2b2b2f',
    borderRadius: 8,
    paddingHorizontal: 14,
    color: COLORS.TEXT_LIGHT,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navLink: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 16,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 20,
  },
  card: {
    width: CARD_WIDTH,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1e1e22',
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
    fontSize: 14,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#4c1b1b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#ffb4b4',
    textAlign: 'center',
    fontSize: 13,
  },
});
