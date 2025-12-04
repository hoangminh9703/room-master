import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HotelDesk';
  isAuthenticated$ = this.authService.isAuthenticated();
  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

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
          alert('Login failed: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
