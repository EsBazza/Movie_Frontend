import axios from 'axios';
import { API_BASE_URL } from '../constants/Constants';

/**
 * Axios API Instance for CineStack Backend
 * 
 * Features:
 * - Centralized configuration
 * - Automatic token attachment via interceptors
 * - Request/Response logging for debugging
 * - Standardized error handling
 */

// Create the main axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Store for auth token (set via setAuthToken)
let authToken = null;

/**
 * Set the auth token for all API requests
 * @param {string|null} token - Django Token Authentication token
 */
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    // Django REST Framework Token Authentication uses "Token" prefix (not "Bearer")
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Get current auth token
 */
export const getAuthToken = () => authToken;

// ========== INTERCEPTORS ==========

// Request interceptor - logs requests in dev mode
api.interceptors.request.use(
  (config) => {
    // Log request for debugging (can be removed in production)
    if (__DEV__) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.warn('🔐 Unauthorized - Token may be expired');
          // Token refresh could be implemented here
          break;
        case 403:
          console.warn('🚫 Forbidden - Access denied');
          break;
        case 404:
          console.warn('🔍 Not Found:', error.config.url);
          break;
        case 500:
          console.error('💥 Server Error:', data);
          break;
        default:
          console.error(`❌ API Error ${status}:`, data);
      }
    } else if (error.request) {
      console.error('📡 Network Error - No response received');
    }
    
    return Promise.reject(error);
  }
);

// ========== API ENDPOINTS ==========

/**
 * Centralized API endpoints for the CineStack app.
 * All methods return Promises that resolve to axios responses.
 */
export const apiEndpoints = {
  // === AUTH ===
  auth: {
    login: (username, password) => 
      api.post('/api/token/', { username, password }),
    
    register: (username, email, password) => 
      api.post('/api/register/', { username, email, password }),
    
    refreshToken: (refreshToken) => 
      api.post('/api/token/refresh/', { refresh: refreshToken }),
  },

  // === PLAYLISTS ===
  playlists: {
    getAll: () => api.get('/api/playlists/'),
    
    getById: (id) => api.get(`/api/playlists/${id}/`),
    
    create: (title, description = '') => 
      api.post('/api/playlists/', { title, description }),
    
    update: (id, data) => 
      api.patch(`/api/playlists/${id}/`, data),
    
    delete: (id) => api.delete(`/api/playlists/${id}/`),
    
    addMovie: (playlistId, movieId, status = 'to_watch') => 
      api.post(`/api/playlists/${playlistId}/add_movie/`, { 
        movie_id: movieId, 
        status 
      }),
    
    removeMovie: (playlistId, movieId) => 
      api.delete(`/api/playlists/${playlistId}/remove_movie/${movieId}/`),
    
    updateMovieStatus: (playlistId, movieId, status) => 
      api.patch(`/api/playlists/${playlistId}/update_item_status/${movieId}/`, { 
        status 
      }),
  },

  // === MOVIES ===
  movies: {
    getAll: () => api.get('/api/movies/'),
    
    getById: (id) => api.get(`/api/movies/${id}/`),
    
    create: (movieData) => api.post('/api/movies/', movieData),
    
    update: (id, movieData) => api.patch(`/api/movies/${id}/`, movieData),
    
    delete: (id) => api.delete(`/api/movies/${id}/`),
    
    // Get or create movie from TMDB ID (lazy loading)
    getOrCreate: (tmdbId, mediaType = 'movie') => 
      api.post('/api/movies/get_or_create/', { tmdb_id: tmdbId, media_type: mediaType }),
  },

  // === TMDB PROXY ===
  tmdb: {
    search: (query, page = 1, type = 'movie') => 
      api.get('/api/tmdb/search/', { params: { query, page, type } }),
    
    getMovieDetails: (tmdbId) => 
      api.get(`/api/tmdb/movies/${tmdbId}/`),

    getTVDetails: (tmdbId) =>
      api.get(`/api/tmdb/tv/${tmdbId}/`),

    getTVSeason: (tmdbId, seasonNumber) =>
      api.get(`/api/tmdb/tv/${tmdbId}/seasons/${seasonNumber}/`),

    getPopular: (type = 'movie', page = 1) =>
      api.get('/api/tmdb/popular/', { params: { type, page } }),
  },
};

// Export both the raw api instance and the structured endpoints
export default api;
