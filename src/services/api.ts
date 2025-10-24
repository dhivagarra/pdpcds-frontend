import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  HealthResponse,
  PredictionRequest,
  PredictionResponse,
  ClinicalFeedbackRequest,
  ClinicalFeedbackResponse,
  ClinicalOutcomeRequest,
  TrainingDataRequest,
  FeedbackStatistics,
  FeedbackSummary,
  ApiError
} from '../types/api';

// Base API configuration - use environment variables for direct connection
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  (error: AxiosError<ApiError>) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Health Check APIs
export const healthApi = {
  // Basic health check
  checkBasicHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  // Detailed health check
  checkDetailedHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/api/v1/health/');
    return response.data;
  },

  // Database health check
  checkDatabaseHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/api/v1/health/database');
    return response.data;
  },
};

// Disease Prediction API
export const predictionApi = {
  // Submit prediction request
  submitPrediction: async (request: PredictionRequest): Promise<PredictionResponse> => {
    const response = await apiClient.post<PredictionResponse>('/api/v1/predict/', request);
    return response.data;
  },
};

// Clinical Feedback API - Complete Implementation
export const feedbackApi = {
  // Submit doctor feedback on prediction
  submitFeedback: async (feedback: ClinicalFeedbackRequest): Promise<ClinicalFeedbackResponse> => {
    const response = await apiClient.post<ClinicalFeedbackResponse>('/api/v1/feedback/prediction-feedback', feedback);
    return response.data;
  },

  // Submit clinical outcome for prediction
  submitOutcome: async (outcome: ClinicalOutcomeRequest): Promise<{ message: string; outcome_id: number }> => {
    const response = await apiClient.post('/api/v1/feedback/clinical-outcome', outcome);
    return response.data;
  },

  // Add expert training data
  addTrainingData: async (trainingData: TrainingDataRequest): Promise<{ message: string; training_id: number }> => {
    const response = await apiClient.post('/api/v1/feedback/add-training-data', trainingData);
    return response.data;
  },

  // Get feedback for specific prediction
  getFeedbackForPrediction: async (predictionId: number): Promise<ClinicalFeedbackRequest[]> => {
    const response = await apiClient.get<ClinicalFeedbackRequest[]>(`/api/v1/feedback/prediction/${predictionId}/feedback`);
    return response.data;
  },

  // Get feedback summary/consensus for prediction
  getFeedbackSummary: async (predictionId: number): Promise<FeedbackSummary> => {
    const response = await apiClient.get<FeedbackSummary>(`/api/v1/feedback/prediction/${predictionId}/summary`);
    return response.data;
  },

  // Get system-wide feedback statistics
  getFeedbackStats: async (): Promise<FeedbackStatistics> => {
    const response = await apiClient.get<FeedbackStatistics>('/api/v1/feedback/feedback-stats');
    return response.data;
  },
};

// Utility function to check if backend is running
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    await healthApi.checkBasicHealth();
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

// Error handling utility
export const handleApiError = (error: AxiosError<ApiError>): string => {
  console.error('API Error Details:', {
    message: error.message,
    code: error.code,
    response: error.response,
    request: error.request
  });

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (status === 422 && data.detail && Array.isArray(data.detail)) {
      // Validation error
      const validationErrors = data.detail.map((err: any) => 
        `${err.loc.join('.')}: ${err.msg}`
      ).join(', ');
      return `Validation Error: ${validationErrors}`;
    }
    
    if (typeof data.detail === 'string') {
      return `Error ${status}: ${data.detail}`;
    }
    
    return `Error ${status}: Server error occurred`;
  }
  
  if (error.request) {
    // Request was made but no response received
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      return 'Network Error: Unable to connect to backend server. Please ensure the backend is running and CORS is properly configured.';
    }
    return `Network Error: Unable to connect to server. Please check if the backend is running on ${API_BASE_URL}`;
  }
  
  // Something else happened
  return `Error: ${error.message}`;
};

export default apiClient;