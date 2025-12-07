import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    if (!window.electronAPI) {
      console.error('Electron API not available');
    }
  }

  async invoke<T>(channel: string, data?: any): Promise<T> {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const response = await window.electronAPI.invoke(channel, data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Unknown error occurred');
      }

      return response.data as T;
    } catch (error) {
      console.error(`IPC Error on channel ${channel}:`, error);
      throw error;
    }
  }

  send(channel: string, data?: any): void {
    try {
      if (!window.electronAPI) {
        console.error('Electron API not available');
        return;
      }

      window.electronAPI.send(channel, data);
    } catch (error) {
      console.error(`IPC Error on channel ${channel}:`, error);
    }
  }

  on<T>(channel: string, callback: (data: T) => void): void {
    try {
      if (!window.electronAPI) {
        console.error('Electron API not available');
        return;
      }

      if (!this.eventListeners.has(channel)) {
        this.eventListeners.set(channel, new Set());

        window.electronAPI.on(channel, (data: T) => {
          const callbacks = this.eventListeners.get(channel);
          if (callbacks) {
            callbacks.forEach(cb => cb(data));
          }
        });
      }

      this.eventListeners.get(channel)?.add(callback);
    } catch (error) {
      console.error(`IPC Error on channel ${channel}:`, error);
    }
  }

  off(channel: string, callback: Function): void {
    const callbacks = this.eventListeners.get(channel);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  onceAsync<T>(channel: string, timeout: number = 5000): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${channel}`));
      }, timeout);

      const handler = (data: T) => {
        clearTimeout(timer);
        this.off(channel, handler);
        resolve(data);
      };

      this.on(channel, handler);
    });
  }

  observeOn<T>(channel: string): Observable<T> {
    return new Observable(observer => {
      const handler = (data: T) => {
        observer.next(data);
      };

      this.on(channel, handler);

      return () => {
        this.off(channel, handler);
      };
    });
  }
}

declare global {
  interface Window {
    electronAPI: {
      invoke(channel: string, data?: any): Promise<any>;
      send(channel: string, data?: any): void;
      on(channel: string, callback: (data: any) => void): void;
      off(channel: string, callback: (data: any) => void): void;
    };
  }
}
