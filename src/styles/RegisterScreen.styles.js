import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/Constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  
  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.PRIMARY_ACCENT,
    letterSpacing: 3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1,
  },

  // Form
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 54,
    backgroundColor: COLORS.CARD_DARK,
    color: COLORS.TEXT_LIGHT,
    paddingHorizontal: 18,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_DARK,
  },
  button: {
    backgroundColor: COLORS.PRIMARY_ACCENT,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: COLORS.PRIMARY_ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 15,
  },
  loginLink: {
    color: COLORS.PRIMARY_ACCENT,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
