import axios from 'axios';

// Create axios instance with retry configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with retry logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // If no config or retry count is not set, initialize it
    if (!config || !config.retryCount) {
      config.retryCount = 0;
    }

    // Check if we should retry the request
    if (config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      
      // Log retry attempt
      console.log(`Retrying request (${config.retryCount}/${MAX_RETRIES})...`);
      
      // Wait before retrying
      await delay(RETRY_DELAY * config.retryCount);
      
      // Retry the request
      return API(config);
    }

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 503:
          console.error('Service temporarily unavailable. Please try again later.');
          break;
        case 401:
          console.error('Unauthorized. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Resource not found. Please check the API endpoint.');
          break;
        default:
          console.error('An error occurred:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error('No response received from server. Please check your internet connection.');
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default API; 