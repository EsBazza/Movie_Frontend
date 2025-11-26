import { apiEndpoints } from './api';
import { TMDB_IMAGE_BASE } from '../constants/Constants';

/**
 * TMDB Service - Wrapper for TMDB API calls
 * 
 * Uses the centralized API layer for all HTTP requests.
 * Provides consistent response format: { success, data, error }
 */
class TMDBService {

  /**
   * Search for movies using TMDB API through your backend
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
   */
  async searchMovies(query, page = 1) {
    try {
      const response = await apiEndpoints.tmdb.search(query, page);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('TMDB Search Error:', error);
      return {
        success: false,
        data: null,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Get movie details from TMDB
   * @param {number} tmdbId - TMDB movie ID
   * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
   */
  async getMovieDetails(tmdbId) {
    try {
      const response = await apiEndpoints.tmdb.getMovieDetails(tmdbId);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('TMDB Movie Details Error:', error);
      return {
        success: false,
        data: null,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Get or create movie in local database from TMDB ID
   * This implements the "lazy loading" pattern - fetch from TMDB only when needed
   * @param {number} tmdbId - TMDB movie ID
   * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
   */
  async getOrCreateMovie(tmdbId) {
    try {
      const response = await apiEndpoints.movies.getOrCreate(tmdbId);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Get or Create Movie Error:', error);
      return {
        success: false,
        data: null,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Error handler for TMDB API calls
   * @param {Error} error - Axios error object
   * @returns {string} - User-friendly error message
   */
  handleError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return 'Authentication failed. Please login again.';
        case 403:
          return 'Access forbidden.';
        case 404:
          return 'Movie not found.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable.';
        default:
          return error.response.data?.error || error.response.data?.message || 'An unexpected error occurred.';
      }
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    } else {
      return 'An unexpected error occurred.';
    }
  }

  /**
   * Format movie data for consistent display
   * @param {Object} movie - Raw movie data from TMDB
   * @returns {Object} - Formatted movie data
   */
  formatMovieData(movie) {
    return {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      genre_ids: movie.genre_ids,
      // Formatted fields
      release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      poster_url: movie.poster_path 
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
        : null,
      backdrop_url: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : null,
      rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : null, // 5-star scale
    };
  }

  /**
   * Format multiple movies data
   * @param {Array} movies - Array of raw movie data
   * @returns {Array} - Array of formatted movie data
   */
  formatMoviesData(movies) {
    return movies.map(movie => this.formatMovieData(movie));
  }

  /**
   * Get image URL for different sizes
   * @param {string} path - Image path from TMDB
   * @param {string} size - Image size ('w200', 'w300', 'w400', 'w500', 'w780', 'w1280', 'original')
   * @returns {string|null} - Complete image URL
   */
  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  /**
   * Get YouTube trailer URL if available
   * @param {Object} movieDetails - Movie details with videos
   * @returns {string|null} - YouTube URL or null
   */
  getTrailerUrl(movieDetails) {
    if (!movieDetails.videos || !movieDetails.videos.results) return null;
    
    const trailer = movieDetails.videos.results.find(
      video => video.site === 'YouTube' && video.type === 'Trailer'
    );
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }
}

// Export singleton instance
const tmdbService = new TMDBService();
export default tmdbService;