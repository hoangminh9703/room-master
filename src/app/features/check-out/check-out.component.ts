import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  occupiedBookings: any[] = [];
  selectedBooking: any = null;
  loading = false;
  error: string | null = null;
  searchQuery = '';

  extraCharges = {
    roomService: 0,
    miniBar: 0,
    laundry: 0
  };

  inspection = {
    damagesFound: false,
    damageDetails: '',
    estimatedRepair: 0
  };

  paymentMethod = 'Cash';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOccupiedBookings();
  }

  loadOccupiedBookings(): void {
    this.loading = true;
    this.error = null;

    this.apiService
      .invoke<any>('booking:search', { status: 'Checked_In' })
      .then((response) => {
        this.occupiedBookings = response.bookings || [];
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load occupied bookings:', err);
        this.error = 'Failed to load occupied bookings';
        this.loading = false;
      });
  }

  selectBooking(booking: any): void {
    this.selectedBooking = booking;
    this.resetCharges();
  }

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
          this.selectBooking(bookings[0]);
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

  getTotalExtraCharges(): number {
    return (this.extraCharges.roomService || 0) + (this.extraCharges.miniBar || 0) + (this.extraCharges.laundry || 0);
  }

  calculateTaxes(): number {
    const roomCharge = this.selectedBooking?.total_price || 0;
    const extraCharge = this.getTotalExtraCharges();
    return (roomCharge + extraCharge) * 0.1;
  }

  calculateTotal(): number {
    if (!this.selectedBooking) return 0;
    
    const roomCharge = this.selectedBooking.total_price || 0;
    const extraCharge = this.getTotalExtraCharges();
    const taxes = this.calculateTaxes();
    
    return roomCharge + extraCharge + taxes;
  }

  calculateBalance(): number {
    const total = this.calculateTotal();
    const paid = (this.selectedBooking?.total_price || 0) * 0.3;
    return total - paid;
  }

  completeCheckOut(): void {
    if (!this.selectedBooking) {
      this.error = 'No booking selected';
      return;
    }

    this.loading = true;
    this.error = null;

    const checkoutData = {
      bookingId: this.selectedBooking.booking_id,
      extraCharges: this.extraCharges,
      inspection: this.inspection,
      paymentMethod: this.paymentMethod
    };

    this.apiService
      .invoke('booking:check-out', checkoutData)
      .then(() => {
        alert('Check-out completed successfully');
        this.resetForm();
        this.loadOccupiedBookings();
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to complete check-out:', err);
        this.error = 'Failed to complete check-out';
        this.loading = false;
      });
  }

  resetCharges(): void {
    this.extraCharges = {
      roomService: 0,
      miniBar: 0,
      laundry: 0
    };
    this.inspection = {
      damagesFound: false,
      damageDetails: '',
      estimatedRepair: 0
    };
    this.paymentMethod = 'Cash';
  }

  resetForm(): void {
    this.searchQuery = '';
    this.selectedBooking = null;
    this.resetCharges();
  }

  cancel(): void {
    this.resetForm();
  }
}
