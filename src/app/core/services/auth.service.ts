import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, AuthState, Account } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
  });

  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'current_user';

  constructor(private apiService: ApiService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const accessToken = localStorage.getItem(this.accessTokenKey);
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    const user = localStorage.getItem(this.userKey);

    if (accessToken && refreshToken && user) {
      try {
        this.authState$.next({
          isAuthenticated: true,
          user: JSON.parse(user),
          accessToken,
          refreshToken,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.updateAuthState({ loading: true, error: null });

    return from(
      this.apiService.login<LoginResponse>({
        username: credentials.username,
        password: credentials.password
      })
    ).pipe(
      map((resp) => {
        const payload = resp.data as any;
        const accessToken = payload?.accessToken || payload?.AccessToken;
        const refreshToken = payload?.refreshToken || payload?.RefreshToken || null;
        const account: Account | User | null = payload?.account || payload?.Account || null;

        if (!accessToken) {
          throw new Error('Missing access token');
        }

        if (accessToken) localStorage.setItem(this.accessTokenKey, accessToken);
        if (refreshToken) localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (account) localStorage.setItem(this.userKey, JSON.stringify(account));

        this.updateAuthState({
          isAuthenticated: true,
          user: account,
          accessToken,
          refreshToken,
          loading: false,
          error: null
        });

        return {
          accessToken,
          refreshToken: refreshToken || '',
          account
        } as LoginResponse;
      }),
      tap({
        error: (err) => this.updateAuthState({ loading: false, error: err?.message || 'Login failed' })
      }),
      catchError((err) => {
        this.updateAuthState({ loading: false, error: err?.message || 'Login failed' });
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.clearAuth();
      observer.next();
      observer.complete();
    });
  }

  verifyToken(): Observable<boolean> {
    const token = this.authState$.value.accessToken;

    return new Observable(observer => {
      observer.next(!!token);
      observer.complete();
    });
  }

  getCurrentUser(): Observable<Account | User | null> {
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

  private toRoleCode(value: any): number {
    if (typeof value === 'number') return value;
    const v = String(value || '').toLowerCase();
    if (v === 'admin' || v === '1') return 1;
    if (v === 'le tan' || v === 'lễ tân' || v === 'receptionist' || v === '2') return 2;
    return 0;
  }

  hasRole(role: string | string[] | number | number[]): Observable<boolean> {
    const requiredRoles = (Array.isArray(role) ? role : [role]).map(r => this.toRoleCode(r));
    return this.authState$.asObservable().pipe(
      map(state => {
        if (!state.isAuthenticated || !state.user) return false;
        const userRoleCode = this.toRoleCode((state.user as any)?.role);
        return requiredRoles.includes(userRoleCode);
      })
    );
  }

  private updateAuthState(partial: Partial<AuthState>): void {
    const current = this.authState$.value;
    this.authState$.next({ ...current, ...partial });
  }

  private clearAuth(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null
    });
  }
}
