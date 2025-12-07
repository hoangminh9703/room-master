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
  total_price: number;
  number_of_nights: number;
}

interface BookingSearchResponse {
  Items: Booking[];
  TotalRows: number;
}

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  occupiedBookings: Booking[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  searchDate: string = '';
  pageIndex = 1;
  pageSize = 10;
  totalRows = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Mặc định search booking ngày hôm nay đã check-in
    this.searchDate = new Date().toISOString().split('T')[0];
    this.loadOccupiedBookings();
  }

  loadOccupiedBookings(): void {
    this.loading = true;
    this.error = null;

    const payload = {
      keyword: this.searchQuery.trim() || null,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      status: 'Checked_In',
      fromDate: null,
      toDate: null,
      searchCheckInDate: this.searchDate || null,
      searchCheckOutDate: null,
      type: this.searchDate ? 1 : null
    };

    this.apiService
      .post<any>('/bookings/search', payload)
      .then((response) => {
        this.occupiedBookings = response.items || [];
        this.totalRows = response.totalRows || 0;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load occupied bookings:', err);
        this.error = 'Failed to load occupied bookings';
        this.loading = false;
      });
  }

  selectBooking(booking: Booking): void {
    // no-op after simplification
  }

  searchBookings(): void {
    this.pageIndex = 1;
    this.loadOccupiedBookings();
  }

  checkOut(booking: Booking): void {
    if (!booking?.booking_id) {
      this.error = 'Missing booking id';
      return;
    }

    this.loading = true;
    this.error = null;

    this.apiService
      .postRaw<any>('/CheckInOut/check-out', { BookingId: booking.booking_id })
      .then((response) => {
        if (response.success) {
          alert('Check-out completed successfully');
          this.loadOccupiedBookings();
        } else {
          this.error = response.message || 'Check-out failed';
        }
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to complete check-out:', err);
        this.error = err.message || 'Failed to complete check-out';
        this.loading = false;
      });
  }

  resetForm(): void {
    this.searchQuery = '';
  }

  cancel(): void {
    this.resetForm();
  }
}
