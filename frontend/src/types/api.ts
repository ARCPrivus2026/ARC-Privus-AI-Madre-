/**
 * API Types for ARC Privus AI Madre
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface User {
  email: string;
  full_name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AIRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  context?: Record<string, any>;
}

export interface AIResponse {
  result: string;
  tokens_used: number;
  processing_time: number;
  model_version: string;
}

export interface AIModel {
  id: string;
  name: string;
  type: string;
  status: string;
  capabilities: string[];
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  uptime_seconds?: number;
  system?: {
    cpu_percent: number;
    memory_percent: number;
    disk_percent: number;
  };
}
