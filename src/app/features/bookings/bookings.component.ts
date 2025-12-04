import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error: string | null = null;
  filter = 'all';

  constructor(private ipcService: IpcService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = null;

    const filters = this.filter === 'all' ? {} : { status: this.filter };

    this.ipcService
      .invoke<any>('booking:search', filters)
      .then((response) => {
        this.bookings = response.bookings || [];
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        this.error = 'Failed to load bookings';
        this.loading = false;
      });
  }

  onFilterChange(): void {
    this.loadBookings();
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.ipcService
        .invoke('booking:cancel', { bookingId, reason: 'User requested' })
        .then(() => {
          this.loadBookings();
        })
        .catch((err) => {
          console.error('Failed to cancel booking:', err);
          alert('Failed to cancel booking');
        });
    }
  }
}
