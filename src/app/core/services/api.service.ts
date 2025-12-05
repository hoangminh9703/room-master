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

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await this.fetchWithTimeout(url, { method: 'GET' });
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'API returned error');
      }

      return data.data as T;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, body: any = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'API returned error');
      }

      return data.data as T;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, body: any = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'API returned error');
      }

      return data.data as T;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await this.fetchWithTimeout(url, { method: 'DELETE' });
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'API returned error');
      }

      return data.data as T;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
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
