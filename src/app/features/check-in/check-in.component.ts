import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  searchQuery = '';
  selectedBooking: any = null;
  loading = false;
  error: string | null = null;
  keyGenerated = false;
  generatedKeyCode = '';

  checklistItems = {
    roomClean: false,
    idVerified: false,
    paymentReceived: false,
    formSigned: false
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  searchBooking(): void {
    if (!this.searchQuery.trim()) {
      this.error = 'Please enter a search term';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService
      .invoke<any>('booking:search', { searchQuery: this.searchQuery })
      .then((response) => {
        const bookings = response.bookings || [];
        if (bookings.length > 0) {
          this.selectedBooking = bookings[0];
        } else {
          this.error = 'Booking not found';
        }
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to search booking:', err);
        this.error = 'Failed to search booking';
        this.loading = false;
      });
  }

  generateKeyCard(): void {
    this.keyGenerated = true;
    this.generatedKeyCode = '•••••';
  }

  completeCheckIn(): void {
    if (!this.selectedBooking) {
      this.error = 'No booking selected';
      return;
    }

    if (!this.checklistItems.roomClean || !this.checklistItems.idVerified || !this.checklistItems.paymentReceived) {
      this.error = 'Please complete all required checks';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService
      .invoke('booking:check-in', { bookingId: this.selectedBooking.booking_id })
      .then(() => {
        alert('Check-in completed successfully');
        this.resetForm();
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to complete check-in:', err);
        this.error = 'Failed to complete check-in';
        this.loading = false;
      });
  }

  resetForm(): void {
    this.searchQuery = '';
    this.selectedBooking = null;
    this.keyGenerated = false;
    this.checklistItems = {
      roomClean: false,
      idVerified: false,
      paymentReceived: false,
      formSigned: false
    };
  }

  cancel(): void {
    this.resetForm();
  }
}
