import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

interface Booking {
  booking_id: string;
  full_name: string;
  phone: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  room_Id: string;
}

interface BookingSearchResponse {
  Items: Booking[];
  TotalRows: number;
}

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  searchQuery = '';
  searchDate: string = '';
  bookings: Booking[] = [];
  loading = false;
  error: string | null = null;
  
  pageIndex = 1;
  pageSize = 10;
  totalRows = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.searchDate = new Date().toISOString().split('T')[0];
    this.searchBookings();
  }

  searchBookings(): void {
    this.loading = true;
    this.error = null;

    const payload = {
      keyword: this.searchQuery.trim() || null,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      status: 'Confirmed',
      fromDate: null,
      toDate: null,
      searchCheckInDate: this.searchDate || null,
      searchCheckOutDate: null,
      type: this.searchDate ? 1 : null
    };

    this.apiService
      .post<any>('/bookings/search', payload)
      .then((response) => {
        this.bookings = response.items || [];
        this.totalRows = response.totalRows || 0;
        
        if (this.bookings.length === 0 && (this.searchQuery.trim() || this.searchDate)) {
          this.error = 'No available bookings for check-in found';
        }
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to search bookings:', err);
        this.error = 'Failed to search bookings';
        this.loading = false;
      });
  }

  checkIn(booking: Booking): void {
    if (!booking?.booking_id) {
      this.error = 'Missing booking id';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService
      .postRaw<any>('/CheckInOut/check-in', { BookingId: booking.booking_id })
      .then((response) => {
        if (response.success) {
          alert('Check-in completed successfully');
          this.searchBookings();
        } else {
          this.error = response.message || 'Check-in failed';
        }
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to complete check-in:', err);
        this.error = err.message || 'Failed to complete check-in';
        this.loading = false;
      });
  }
}
