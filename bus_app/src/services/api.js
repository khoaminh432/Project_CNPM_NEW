// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic API request handler
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default {
  apiRequest,
  API_BASE_URL,
};
