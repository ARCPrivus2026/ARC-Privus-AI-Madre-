/**
 * API Client for ARC Privus AI Madre
 * Handles all HTTP communication with the backend
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AIRequest,
  AIResponse,
  AIModel,
  HealthStatus,
} from '../types/api';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Health endpoints
  async getHealth(): Promise<HealthStatus> {
    const response = await this.client.get<HealthStatus>('/health');
    return response.data;
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const response = await this.client.get<HealthStatus>('/api/v1/health/status');
    return response.data;
  }

  // Authentication endpoints
  async register(data: RegisterData): Promise<{ message: string; email: string }> {
    const response = await this.client.post('/api/v1/auth/register', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await this.client.post<AuthTokens>('/api/v1/auth/login', credentials);
    const tokens = response.data;
    localStorage.setItem('access_token', tokens.access_token);
    return tokens;
  }

  async verifyToken(): Promise<{ status: string; user: string }> {
    const response = await this.client.get('/api/v1/auth/verify');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  // AI endpoints
  async aiInference(request: AIRequest): Promise<AIResponse> {
    const response = await this.client.post<AIResponse>('/api/v1/ai/infer', request);
    return response.data;
  }

  async getAIModels(): Promise<{ models: AIModel[] }> {
    const response = await this.client.get('/api/v1/ai/models');
    return response.data;
  }

  async getAICapabilities(): Promise<{
    capabilities: Array<{
      name: string;
      description: string;
      status: string;
    }>;
    modules: Record<string, string>;
  }> {
    const response = await this.client.get('/api/v1/ai/capabilities');
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
