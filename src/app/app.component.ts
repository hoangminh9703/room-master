import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { NgForm } from '@angular/forms';
import { AuthState } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HotelDesk';
  isAuthenticated$ = this.authService.isAuthenticated();
  authState$ = this.authService.getAuthState();
  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  private roleCode(val: any): number {
    if (typeof val === 'number') return val;
    const v = String(val || '').toLowerCase();
    if (v === '1' || v === 'admin') return 1;
    if (v === '2' || v === 'le tan' || v === 'lễ tân' || v === 'receptionist') return 2;
    return 0;
  }

  isAdmin(auth: AuthState | null): boolean {
    if (!auth?.user) return false;
    return this.roleCode((auth.user as any).role) === 1;
  }

  isReceptionist(auth: AuthState | null): boolean {
    if (!auth?.user) return false;
    return this.roleCode((auth.user as any).role) === 2;
  }

  canViewReports(auth: AuthState | null): boolean {
    return this.isAdmin(auth); // Only admin
  }

  canManageRooms(auth: AuthState | null): boolean {
    return this.isAdmin(auth) || this.isReceptionist(auth);
  }

  canManageBookings(auth: AuthState | null): boolean {
    return this.isAdmin(auth) || this.isReceptionist(auth);
  }

  login(): void {
    if (this.loginForm.valid) {
      const credentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
      this.authService.login(credentials).subscribe({
        next: () => {
          this.loginForm.resetForm();
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Login failed: ' + (err?.message || 'Unknown error'));
        }
      });
    }
  }

  logout(): void {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      this.authService.logout().subscribe();
    }
  }
}
