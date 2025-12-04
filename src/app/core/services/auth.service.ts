import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpcService } from './ipc.service';
import { User, LoginRequest, LoginResponse, AuthState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  constructor(private ipcService: IpcService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');

    if (token && user) {
      try {
        this.authState$.next({
          isAuthenticated: true,
          user: JSON.parse(user),
          token,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      this.updateAuthState({ loading: true, error: null });

      this.ipcService.invoke<LoginResponse>('auth:login', credentials)
        .then(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));

          this.updateAuthState({
            isAuthenticated: true,
            user: response.user,
            token: response.token,
            loading: false,
            error: null
          });

          observer.next(response);
          observer.complete();
        })
        .catch(error => {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          this.updateAuthState({ loading: false, error: errorMessage });
          observer.error(error);
        });
    });
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.ipcService.invoke('auth:logout', {})
        .then(() => {
          this.clearAuth();
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Logout error:', error);
          this.clearAuth();
          observer.error(error);
        });
    });
  }

  verifyToken(): Observable<boolean> {
    const token = this.authState$.value.token;

    if (!token) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    return new Observable(observer => {
      this.ipcService.invoke<{ valid: boolean }>('auth:verify-token', { token })
        .then((response: any) => {
          const isValid = response?.valid ?? false;
          if (!isValid) {
            this.clearAuth();
          }
          observer.next(isValid);
          observer.complete();
        })
        .catch(error => {
          console.error('Token verification error:', error);
          this.clearAuth();
          observer.next(false);
          observer.complete();
        });
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.authState$.asObservable().pipe(
      map(state => state.user)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState$.asObservable().pipe(
      map(state => state.isAuthenticated)
    );
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  hasRole(role: string | string[]): Observable<boolean> {
    const roles = Array.isArray(role) ? role : [role];
    return this.authState$.asObservable().pipe(
      map(state => state.isAuthenticated && state.user ? roles.includes(state.user.role) : false)
    );
  }

  private updateAuthState(partial: Partial<AuthState>): void {
    const current = this.authState$.value;
    this.authState$.next({ ...current, ...partial });
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }
}
