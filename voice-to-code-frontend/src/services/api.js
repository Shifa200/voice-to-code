import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running. Please start your backend server.');
    }
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
);

/**
 * Generate code from speech transcript
 */
export const generateCodeFromSpeech = async (transcript) => {
  try {
    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Please provide a transcript to generate code');
    }

    const response = await apiClient.post('/generate-code', {
      transcript: transcript.trim(),
      sessionId: `session_${Date.now()}`, // Simple session ID
    });

    if (response.data.success) {
      return {
        code: response.data.data.code,
        transcript: response.data.data.transcript,
        timestamp: response.data.data.timestamp
      };
    } else {
      throw new Error(response.data.message || 'Failed to generate code');
    }
  } catch (error) {
    console.error('Code generation failed:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Invalid request. Please check your input.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
};

/**
 * Check backend health
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Backend server is not available');
  }
};

/**
 * Test connection to backend
 */
export const testConnection = async () => {
  try {
    const health = await checkBackendHealth();
    console.log('🟢 Backend connection successful:', health);
    return true;
  } catch (error) {
    console.error('🔴 Backend connection failed:', error.message);
    return false;
  }
};

// Export the API client for direct use if needed
export default apiClient;