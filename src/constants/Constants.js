/**
 * CineStack App Constants
 * 
 * This file contains all the configuration constants for the app.
 * Update API_BASE_URL before deployment!
 */

// ========== COLORS ==========
export const COLORS = {
  PRIMARY_ACCENT: '#E50914',    // Netflix-style red
  BACKGROUND_DARK: '#141414',   // Dark background
  CARD_DARK: '#2D2D2D',         // Card background
  TEXT_LIGHT: '#FFFFFF',        // Primary text
  TEXT_MUTED: '#8C8C8C',        // Secondary text
  STAR_RATING: '#FFD700',       // Gold for ratings
  DELETE_RED: '#FF4444',        // Delete/danger actions
  SUCCESS_GREEN: '#4CAF50',     // Success states
};

// ========== API CONFIGURATION ==========

/**
 * ⚠️ IMPORTANT: Update this URL before deployment!
 * 
 * Development: Use your local IP (e.g., 'http://192.168.1.100:8000')
 * Production: Use your deployed backend URL (e.g., 'https://cinestack-api.onrender.com')
 * 
 * Note: 'localhost' won't work on physical devices - use your machine's IP address
 */
export const API_BASE_URL = 'http://192.168.20.240:8000'; // Your device IP
// export const API_BASE_URL = 'http://10.0.2.2:8000'; // Android emulator
// export const API_BASE_URL = 'http://localhost:8000'; // iOS simulator / Web
// export const API_BASE_URL = 'https://your-cinestack-backend.onrender.com'; // Production

// Legacy endpoint constants (kept for backwards compatibility)
// Prefer using apiEndpoints from services/api.js instead
export const API_TOKEN_OBTAIN = `${API_BASE_URL}/api/token/`;
export const API_REGISTER = `${API_BASE_URL}/api/register/`;
export const API_PLAYLISTS = `${API_BASE_URL}/api/playlists/`;
export const API_MOVIES = `${API_BASE_URL}/api/movies/`;
export const API_PLAYLIST_ITEMS = `${API_BASE_URL}/api/playlist-items/`;

// ========== WATCH STATUS OPTIONS ==========
export const STATUS_CHOICES = [
  { label: 'To Watch', value: 'to_watch', color: COLORS.TEXT_MUTED },
  { label: 'Watching', value: 'watching', color: COLORS.STAR_RATING },
  { label: 'Watched', value: 'watched', color: COLORS.SUCCESS_GREEN },
];

// Helper function to get status by value
export const getStatusByValue = (value) => 
  STATUS_CHOICES.find(s => s.value === value) || STATUS_CHOICES[0];

// ========== TMDB CONFIGURATION ==========
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';