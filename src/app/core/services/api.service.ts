import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MockDataService } from './mock-data.service';
import { Room } from '../models';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  private timeout = 30000;
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private mockDataService: MockDataService) {}

  

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = this.timeout
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(accessToken: string, refreshToken?: string): void {
    if (accessToken) localStorage.setItem(this.accessTokenKey, accessToken);
    if (refreshToken) localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  private async requestRaw<T>(
    method: string,
    endpoint: string,
    body?: any,
    requiresAuth: boolean = true,
    allowRefresh: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: any = {};
    const accessToken = this.getAccessToken();
    if (requiresAuth && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const doFetch = async (): Promise<Response> => {
      return await this.fetchWithTimeout(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers
      });
    };

    let response = await doFetch();

    // Attempt refresh on 401 once
    if (response.status === 401 && requiresAuth && allowRefresh) {
      const refreshed = await this.tryRefreshTokens();
      if (refreshed) {
        const newAccess = this.getAccessToken();
        if (newAccess) {
          headers['Authorization'] = `Bearer ${newAccess}`;
        }
        response = await doFetch();
      }
    }

    const data: any = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err: any = new Error(data?.message || `HTTP Error: ${response.status}`);
      err.status = response.status;
      throw err;
    }

    const success = data?.success ?? data?.Success ?? true;
    const payload = (data?.data ?? data?.Data ?? null) as T;
    return { success, message: data?.message, data: payload, errors: data?.errors };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    requiresAuth: boolean = true
  ): Promise<T> {
    const resp = await this.requestRaw<T>(method, endpoint, body, requiresAuth);
    if (!resp.success) {
      throw new Error(resp.message || 'API returned error');
    }
    return resp.data as T;
  }

  private async tryRefreshTokens(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const url = `${this.baseUrl}/accounts/refresh`;
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data: any = await response.json();
      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const payload = data?.data || data?.Data;
      const access = payload?.accessToken || payload?.AccessToken;
      const refresh = payload?.refreshToken || payload?.RefreshToken || refreshToken;
      if (access) {
        this.setTokens(access, refresh);
        return true;
      }
      return false;
    } catch (err) {
      this.clearTokens();
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return await this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, body: any = {}): Promise<T> {
    return await this.request<T>('POST', endpoint, body);
  }

  async postRaw<T>(endpoint: string, body: any = {}): Promise<ApiResponse<T>> {
    return await this.requestRaw<T>('POST', endpoint, body);
  }

  async put<T>(endpoint: string, body: any = {}): Promise<T> {
    return await this.request<T>('PUT', endpoint, body);
  }

  async putRaw<T>(endpoint: string, body: any = {}): Promise<ApiResponse<T>> {
    return await this.requestRaw<T>('PUT', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return await this.request<T>('DELETE', endpoint);
  }

  async login<T>(body: any): Promise<ApiResponse<T>> {
    return await this.requestRaw<T>('POST', '/accounts/login', body, false, false);
  }

  async invoke<T>(channel: string, data?: any): Promise<T> {
    const channelMap: { [key: string]: { method: string; endpoint: string } } = {
      'booking:search': { method: 'post', endpoint: '/bookings/date-range' },
      'booking:check-in': { method: 'post', endpoint: '/checkinout/check-in' },
      'booking:check-out': { method: 'post', endpoint: '/checkinout/check-out' },
      'booking:create': { method: 'post', endpoint: '/bookings' },
      'booking:update': { method: 'put', endpoint: '/bookings/{bookingId}' },
      'booking:cancel': { method: 'post', endpoint: '/bookings/{bookingId}/cancel' },
      'room:list': { method: 'get', endpoint: '/rooms' },
      'room:available': { method: 'post', endpoint: '/rooms/available' },
      'room:update-status': { method: 'put', endpoint: '/rooms/{roomId}/status' },
      'guest:list': { method: 'get', endpoint: '/guests/search/' },
      'guest:create': { method: 'post', endpoint: '/guests' },
      'guest:update': { method: 'put', endpoint: '/guests/{guestId}' },
      'guest:delete': { method: 'delete', endpoint: '/guests/{guestId}' },
      'report:revenue': { method: 'post', endpoint: '/dashboard/revenue-report' },
      'report:occupancy': { method: 'post', endpoint: '/dashboard/occupancy-stats' },
      'report:bookings': { method: 'post', endpoint: '/bookings/date-range' }
    };

    const mapping = channelMap[channel];
    if (!mapping) {
      throw new Error(`Unknown channel: ${channel}`);
    }

    let endpoint = mapping.endpoint;
    const requestData = { ...data };

    if (mapping.endpoint.includes('{bookingId}') && data?.bookingId) {
      endpoint = endpoint.replace('{bookingId}', data.bookingId);
      delete requestData.bookingId;
    }

    if (mapping.endpoint.includes('{guestId}') && data?.guestId) {
      endpoint = endpoint.replace('{guestId}', data.guestId);
      delete requestData.guestId;
    }

    if (mapping.endpoint.includes('{roomId}') && data?.roomId) {
      endpoint = endpoint.replace('{roomId}', data.roomId);
      delete requestData.roomId;
    }

    try {
      let result: T;
      if (mapping.method === 'get') {
        result = await this.get<T>(endpoint);
      } else if (mapping.method === 'post') {
        result = await this.post<T>(endpoint, requestData);
      } else if (mapping.method === 'put') {
        result = await this.put<T>(endpoint, requestData);
      } else if (mapping.method === 'delete') {
        result = await this.delete<T>(endpoint);
      } else {
        throw new Error(`Unknown HTTP method: ${mapping.method}`);
      }
      return result;
    } catch (error) {
      console.error(`IPC Channel ${channel} failed:`, error);      
      throw error;
    }
  }
}
