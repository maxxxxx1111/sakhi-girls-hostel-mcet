/**
 * Type-Safe HTTP Client for Sakhi Girls Hostel ERP
 * Provides standardized request/response lifecycle, timeout protection,
 * and unified error normalization.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(statusCode: number, message: string, code = 'CLIENT_API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl = '/api';
  private authToken: string | null = null;

  constructor() {
    // Restore token from localStorage on initialization if available
    try {
      this.authToken = localStorage.getItem('sakhi_auth_token');
    } catch {
      this.authToken = null;
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    try {
      if (token) {
        localStorage.setItem('sakhi_auth_token', token);
      } else {
        localStorage.removeItem('sakhi_auth_token');
      }
    } catch {
      // Ignore storage errors in sandbox
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    if (this.authToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const errorMsg = data?.error?.message || data?.error || data?.message || response.statusText || 'Request failed';
        const errorCode = data?.error?.code || `HTTP_${response.status}`;
        throw new ApiClientError(response.status, errorMsg, errorCode, data?.error?.details);
      }

      // If wrapped in our standard ApiResponse, return data payload; otherwise return raw data
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        return data.data as T;
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiClientError(408, 'API request timed out', 'TIMEOUT');
      }
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError(0, err.message || 'Network communication error', 'NETWORK_ERROR');
    }
  }

  get<T>(endpoint: string, queryParams?: Record<string, string | number | undefined>): Promise<T> {
    let url = endpoint;
    if (queryParams) {
      const search = new URLSearchParams();
      Object.entries(queryParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null) search.append(k, String(v));
      });
      const q = search.toString();
      if (q) url += (url.includes('?') ? '&' : '?') + q;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(urlOrEndpoint(endpoint), {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(urlOrEndpoint(endpoint), {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(urlOrEndpoint(endpoint), {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(urlOrEndpoint(endpoint), { method: 'DELETE' });
  }
}

function urlOrEndpoint(ep: string) {
  return ep;
}

export const apiClient = new ApiClient();
