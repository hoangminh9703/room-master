import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor() {
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

      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const now = new Date().toISOString();
          const user: User = {
            user_id: '1',
            username: 'admin',
            email: 'admin@hoteldesk.com',
            role: 'Admin',
            status: 'Active',
            created_at: now,
            updated_at: now
          };
          const token = 'demo-token-' + Date.now();
          const expiresIn = 86400;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('current_user', JSON.stringify(user));

          this.updateAuthState({
            isAuthenticated: true,
            user,
            token,
            loading: false,
            error: null
          });

          observer.next({ success: true, user, token, expiresIn });
          observer.complete();
        } else {
          const errorMessage = 'Invalid credentials. Use admin / admin123';
          this.updateAuthState({ loading: false, error: errorMessage });
          observer.error(new Error(errorMessage));
        }
      }, 500);
    });
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        this.clearAuth();
        observer.next();
        observer.complete();
      }, 300);
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
      setTimeout(() => {
        const isValid = token.startsWith('demo-token-');
        observer.next(isValid);
        observer.complete();
      }, 300);
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
